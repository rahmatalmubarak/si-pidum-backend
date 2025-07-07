const { v4: uuidv4 } = require('uuid');
const db = require('../config/db'); // mysql2/promise

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
