const { v4: uuidv4 } = require('uuid');
const db = require('../config/db'); // koneksi mysql2
const axios = require('axios');
const https = require('https');

exports.getAllPerkara = async (req, res) => {
  const {
    tuId,
    jaksaId,
    sort_by,
    order,
    habisPenahanan,
    tanggalBerkas,
    tanggalSidang
  } = req.query;

  let query = 'SELECT * FROM perkara WHERE 1=1';
  const values = [];

  // Filter by tuId
  if (tuId) {
    query += ' AND tu_id = ?';
    values.push(tuId);
  }

  // Filter by jaksaId (bisa jaksa_id atau jaksa_kedua_id)
  if (jaksaId) {
    query += ' AND (jaksa_id = ? OR jaksa_kedua_id = ?)';
    values.push(jaksaId, jaksaId);
  }

  // Filter by habis_penahanan
  if (habisPenahanan) {
    query += ' AND habis_penahanan = ?';
    values.push(habisPenahanan);
  }

  // Filter by tanggal_berkas
  if (tanggalBerkas) {
    query += ' AND tanggal_berkas = ?';
    values.push(tanggalBerkas);
  }

  // Filter by tanggal_sidang
  if (tanggalSidang) {
    query += ' AND tanggal_sidang = ?';
    values.push(tanggalSidang);
  }

  // Sorting
  const allowedSort = ['tanggal_sidang', 'habis_penahanan', 'tanggal_berkas'];
  const allowedOrder = ['asc', 'desc'];

  if (sort_by && allowedSort.includes(sort_by.toLowerCase())) {
    const column = sort_by.toLowerCase();
    const direction = allowedOrder.includes(order?.toLowerCase()) ? order.toUpperCase() : 'ASC';
    query += ` ORDER BY ${column} ${direction}`;
  }

  try {
    const [rows] = await db.query(query, values);

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'Berhasil Menampilkan Seluruh Data Perkara',
      data: rows,
    });
  } catch (error) {
    console.error(error);
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
      } = item;

      // ======= CEK APAKAH DATA SUDAH ADA =======
      const [rows] = await db.query(
        'SELECT id FROM perkara WHERE nama_tersangka = ? AND no_surat  LIMIT 1',
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
          tdw,
          no_berkas,
          no_surat,
          new Date(tgl_surat).toISOString().slice(0, 10),
          ur_ipp,
          undang_pasal,
          tempat_kejadian,
          new Date(terima_spdp).toISOString().slice(0, 10),
          null,
          null,
          null,
          null,
          null,
          null,
          null,
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
    console.error(err);
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
    console.error('Error getPerkaraById:', error);
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
    namaTersangka,
    undangPasal,
    tahapanBerkas,
    tanggalBerkas,
    tahapanSidang,
    tanggalSidang,
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
        nama_tersangka   = ?, undang_pasal    = ?,  tahapan_berkas = ?, tanggal_berkas = ?,
        tahapan_sidang   = ?,  tanggal_sidang = ?,
        jaksa_id         = ?,  jaksa_kedua_id = ?, tu_id = ?,
        habis_penahanan  = ?,  updated_at = NOW()
       WHERE id = ?`,
      [
        namaTersangka,
        undangPasal,
        tahapanBerkas,
        tanggalBerkas,
        tahapanSidang,
        tanggalSidang,
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
    console.error(err);
    return res.status(500).json({
      success: false,
      status: 500,
      message: 'Terjadi kesalahan saat mengubah data perkara',
    });
  }
};
