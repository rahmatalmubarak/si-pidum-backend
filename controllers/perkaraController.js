const { v4: uuidv4 } = require('uuid');
const db = require('../config/db'); // koneksi mysql2

exports.createPerkara = async (req, res) => {
  const {
    namaTersangka,
    tahapanBerkas,
    tanggalBerkas,
    tahapanSidang,
    tanggalSidang,
    jaksaId,
    jaksaKeduaId,
    tuId,
    habisPenahanan
  } = req.body;

  if (!namaTersangka || !habisPenahanan) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "namaTersangka dan habisPenahanan wajib diisi"
    });
  }

  try {
    const id = uuidv4();
    const now = new Date();

    const query = `
      INSERT INTO perkara (
        id, nama_tersangka, tahapan_berkas, tanggal_berkas, 
        tahapan_sidang, tanggal_sidang, jaksa_id, jaksa_kedua_id, 
        tu_id, habis_penahanan, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      id,
      namaTersangka,
      tahapanBerkas || null,
      tanggalBerkas || null,
      tahapanSidang || null,
      tanggalSidang || null,
      jaksaId || null,
      jaksaKeduaId || null,
      tuId || null,
      habisPenahanan,
      now,
      now,
    ];

    await db.query(query, values);

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Perkara Berhasil ditambahkan",
      data: {
        id,
        namaTersangka,
        tahapanBerkas,
        tanggalBerkas,
        tahapanSidang,
        tanggalSidang,
        jaksaId,
        jaksaKeduaId,
        tuId,
        habisPenahanan
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Terjadi kesalahan saat menambahkan perkara"
    });
  }
};

exports.getAllPerkara = async (req, res) => {
  const { tuId, jaksaId, sort_by, order } = req.query;

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

  // Sorting
  const allowedSort = ['tanggalSidang', 'habisPenahanan', 'tanggalBerkas'];
  const allowedOrder = ['asc', 'desc'];

  if (sort_by && allowedSort.includes(sort_by)) {
    const orderDirection = allowedOrder.includes(order?.toLowerCase()) ? order : 'asc';
    query += ` ORDER BY ${sort_by} ${orderDirection.toUpperCase()}`;
  }

  try {
    const [rows] = await db.query(query, values);

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Berhasil Menampilkan Seluruh Data Perkara",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Terjadi kesalahan saat mengambil data perkara",
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
