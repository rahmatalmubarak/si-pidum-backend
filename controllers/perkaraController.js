const { v4: uuidv4 } = require('uuid');
const db = require('../config/db'); // koneksi mysql2
const axios = require('axios');
const https = require('https');
const moment = require('moment-timezone');

exports.getAllPerkara = async (req, res) => {
  const {
    tuId,
    jaksaId,
    sort_by,
    order,
    habisPenahanan,
    tahapanBerkas,
    tahapanSidang,
    tanggalBerkas,
    tanggalSidang,
  } = req.query;

  // Mapping field untuk sort
  const sortFieldMap = {
    tanggalSidang: 'p.tanggal_sidang',
    habisPenahanan: 'p.habis_penahanan',
    tanggalBerkas: 'p.tanggal_berkas',
  };

  const allowedOrder = ['asc', 'desc'];

  let query = `
    SELECT 
      p.*, 
      u1.nama AS nama_jaksa, 
      u2.nama AS nama_jaksa_kedua, 
      u3.nama AS nama_tu
    FROM perkara p
    LEFT JOIN users u1 ON p.jaksa_id = u1.id
    LEFT JOIN users u2 ON p.jaksa_kedua_id = u2.id
    LEFT JOIN users u3 ON p.tu_id = u3.id
    WHERE 1=1
  `;

  const values = [];

  // Filter
  if (tuId) {
    query += ' AND p.tu_id = ?';
    values.push(tuId);
  }

  if (jaksaId) {
    query += ' AND (p.jaksa_id = ? OR p.jaksa_kedua_id = ?)';
    values.push(jaksaId, jaksaId);
  }

  if (habisPenahanan) {
    query += ' AND p.habis_penahanan = ?';
    values.push(habisPenahanan);
  }

  if (tahapanBerkas) {
    query += ' AND p.tahapan_berkas = ?';
    values.push(tahapanBerkas);
  }

  if (tahapanSidang) {
    query += ' AND p.tahapan_sidang = ?';
    values.push(tahapanSidang);
  }

  if (tanggalBerkas) {
    query += ' AND p.tanggal_berkas = ?';
    values.push(tanggalBerkas);
  }

  if (tanggalSidang) {
    query += ' AND p.tanggal_sidang = ?';
    values.push(tanggalSidang);
  }

  // Sorting
  if (sort_by && sortFieldMap[sort_by]) {
    const column = sortFieldMap[sort_by];
    const direction = allowedOrder.includes(order?.toLowerCase()) ? order.toUpperCase() : 'ASC';

    if (sort_by === 'tanggalSidang') {
      query += `
        ORDER BY 
          (p.tahapan_sidang = 'Inkracht') ASC,
          (${column} IS NULL) ASC,
          ${column} ${direction}
      `;
    } else if (sort_by === 'tanggalBerkas') {
      query += `
        ORDER BY 
          (p.tahapan_berkas = 'Pelimpahan ke Pengadilan') ASC,
          (${column} IS NULL) ASC,
          ${column} ${direction}
      `;
    } else {
      query += ` ORDER BY (${column} IS NULL), ${column} ${direction}`;
    }
  }

  try {
    const [rows] = await db.query(query, values);

    const data = rows.map(row => ({
      ...row,
      tanggal_berkas: row.tanggal_berkas ? moment(row.tanggal_berkas).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') : null,
      tanggal_sidang: row.tanggal_sidang ? moment(row.tanggal_sidang).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') : null,
      habis_penahanan: row.habis_penahanan ? moment(row.habis_penahanan).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') : null,
      created_at: row.created_at ? moment(row.created_at).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') : null,
      updated_at: row.updated_at ? moment(row.updated_at).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss') : null,
    }));

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'Berhasil Menampilkan Seluruh Data Perkara',
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: 'Terjadi kesalahan saat mengambil data perkara',
    });
  }
};

exports.syncPerkaraFromCMS = async (req, res) => {
  try {
    // SSL agent (abaikan verifikasi sertifikat untuk CMS)
    const agent = new https.Agent({ rejectUnauthorized: false });

    // Tambahkan timestamp agar endpoint tidak di-cache
    const timestamp = Date.now();
    const url =
      'https://cms-publik.kejaksaan.go.id/api/pidum/filtered?tahun=2025&satker=03.03.01&_=' +
      timestamp;

    const response = await axios.get(url, { httpsAgent: agent });

    const data = response.data.data?.main?.data || [];

    const inserted = [];
    const skipped = [];

    for (const item of data) {
      const {
        tdw /* nama tersangka */,
        no_berkas,
        no_surat,
        tgl_surat,
        ur_ipp,
        undang_pasal,
        tempat_kejadian,
        terima_spdp,
        tgl_p48,
        tahap_2,
      } = item;

      // ======= CEK APAKAH DATA SUDAH ADA =======
      const [rows] = await db.query(
        'SELECT id FROM perkara WHERE nama_tersangka = ? AND no_surat = ? LIMIT 1',
        [tdw, no_surat]
      );

      if (rows.length > 0) {
        skipped.push({ tdw, no_surat });
        continue; // ➜ lewati insert
      }

      // ======= INSERT BARU =======
      const id = uuidv4();

      await db.query(
        `INSERT INTO perkara (
          id, nama_tersangka, no_berkas, no_surat, tgl_surat, ur_ipp,
          undang_pasal, tempat_kejadian, terima_spdp,
          tahapan_berkas, tanggal_berkas, tahapan_sidang, tanggal_sidang,
          jaksa_id, jaksa_kedua_id, tu_id, habis_penahanan,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          id,
          tdw, // nama_tersangka
          no_berkas,
          no_surat,
          tgl_surat ? new Date(tgl_surat).toISOString().slice(0, 10) : null,
          ur_ipp,
          undang_pasal,
          tempat_kejadian,
          terima_spdp ? new Date(terima_spdp).toISOString().slice(0, 10) : null,

          // Berkas
          tahap_2 ? 'Pelimpahan ke Pengadilan' : null, // tahapan_berkas
          tahap_2 ? new Date(tahap_2).toISOString().slice(0, 10) : null, // tanggal_berkas

          // Sidang
          tgl_p48 ? 'Inkracht' : null, // tahapan_sidang
          tgl_p48 ? new Date(tgl_p48).toISOString().slice(0, 10) : null, // tanggal_sidang

          null, // jaksa_id
          null, // jaksa_kedua_id
          null, // tu_id

          // habis_penahanan
          new Date().toISOString().slice(0, 10),
        ]
      );

      inserted.push({ id, no_berkas, no_surat });
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'Sinkronisasi selesai',
      insertedCount: inserted.length,
      skippedCount: skipped.length,
      inserted,
      skipped,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: 'Terjadi kesalahan saat sinkronisasi',
    });
  }
};


exports.getPerkaraById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM perkara WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Perkara tidak ditemukan',
      });
    }

    const perkara = rows[0];

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'Berhasil Menampilkan data Perkara',
      data: {
        id: perkara.id,
        namaTersangka: perkara.nama_tersangka,
        tahapanBerkas: perkara.tahapan_berkas,
        tanggalBerkas: perkara.tanggal_berkas,
        tahapanSidang: perkara.tahapan_sidang,
        tanggalSidang: perkara.tanggal_sidang,
        jaksaId: perkara.jaksa_id,
        jaksaKeduaId: perkara.jaksa_kedua_id,
        tuId: perkara.tu_id,
        habisPenahanan: perkara.habis_penahanan,
        createdAt: perkara.created_at,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      status: 500,
      message: 'Terjadi kesalahan server',
    });
  }
};

exports.updatePerkara = async (req, res) => {
  const { id } = req.params;
  const {
    jaksaId,
    jaksaKeduaId,
    tuId,
    habisPenahanan,
  } = req.body;

  try {
    // Pastikan perkara ada
    const [exist] = await db.query('SELECT * FROM perkara WHERE id = ?', [id]);
    if (exist.length === 0) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Perkara tidak ditemukan',
      });
    }

    // Update
    await db.query(
      `UPDATE perkara SET
        jaksa_id         = ?,  jaksa_kedua_id = ?, tu_id = ?,
        habis_penahanan  = ?,  updated_at = NOW()
       WHERE id = ?`,
      [
        jaksaId,
        jaksaKeduaId,
        tuId,
        habisPenahanan,
        id,
      ]
    );

    // Ambil data terbaru
    const [updatedRows] = await db.query('SELECT * FROM perkara WHERE id = ?', [id]);
    const p = updatedRows[0];

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'Berhasil Mengubah data Perkara',
      data: {
        id: p.id,
        namaTersangka: p.nama_tersangka,
        undangPasal: p.undang_pasal,
        tahapanBerkas: p.tahapan_berkas,
        tanggalBerkas: p.tanggal_berkas,
        tahapanSidang: p.tahapan_sidang,
        tanggalSidang: p.tanggal_sidang,
        jaksaId: p.jaksa_id,
        jaksaKeduaId: p.jaksa_kedua_id,
        tuId: p.tu_id,
        habisPenahanan: p.habis_penahanan,
        createdAt: p.created_at,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      status: 500,
      message: 'Terjadi kesalahan saat mengubah data perkara',
    });
  }
};

exports.updateSidang = async (req, res) => {
  const { id } = req.params;
  const { tahapanSidang, tanggalSidang } = req.body;

  try {
    const [exist] = await db.query('SELECT * FROM perkara WHERE id = ?', [id]);
    if (exist.length === 0) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Perkara tidak ditemukan',
      });
    }

    await db.query(
      `UPDATE perkara SET tahapan_sidang = ?, tanggal_sidang = ?, updated_at = NOW() WHERE id = ?`,
      [tahapanSidang, tanggalSidang, id]
    );

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'Jadwal Sidang berhasil diperbarui',
      data: { id, tahapanSidang, tanggalSidang },
    });
  } catch (error) {
    return res.status(500).json({ success: false, status: 500, message: 'Gagal memperbarui jadwal sidang' });
  }
};

exports.updateBerkas = async (req, res) => {
  const { id } = req.params;
  const { tahapanBerkas, tanggalBerkas } = req.body;

  try {
    const [exist] = await db.query('SELECT * FROM perkara WHERE id = ?', [id]);
    if (exist.length === 0) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'Perkara tidak ditemukan',
      });
    }

    await db.query(
      `UPDATE perkara SET tahapan_berkas = ?, tanggal_berkas = ?, updated_at = NOW() WHERE id = ?`,
      [tahapanBerkas, tanggalBerkas, id]
    );

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'Tahapan Berkas berhasil diperbarui',
      data: { id, tahapanBerkas, tanggalBerkas },
    });
  } catch (error) {
    return res.status(500).json({ success: false, status: 500, message: 'Gagal memperbarui tahapan berkas' });
  }
};

