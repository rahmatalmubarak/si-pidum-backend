const connection = require('../config/db');

exports.getAll = (callback) => {
  connection.query('SELECT * FROM perkara', callback);
};

exports.getById = (id, callback) => {
  connection.query('SELECT * FROM perkara WHERE id = ?', [id], callback);
};

exports.create = (data, callback) => {
  const sql = `
    INSERT INTO perkara (
      nama_tersangka, tahapan_berkas, tanggal_berkas,
      tahapan_sidang, tanggal_sidang,
      jaksa_id, jaksa_kedua_id, tu_id, habis_penahanan
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [
      data.nama_tersangka,
      data.tahapan_berkas,
      data.tanggal_berkas,
      data.tahapan_sidang,
      data.tanggal_sidang,
      data.jaksa_id,
      data.jaksa_kedua_id,
      data.tu_id,
      data.habis_penahanan
    ],
    (err, result) => {
      if (err) return callback(err);
      callback(null, { id: result.insertId, ...data });
    }
  );
};

exports.update = (id, data, callback) => {
  const sql = `
    UPDATE perkara SET
      nama_tersangka = ?,
      tahapan_berkas = ?,
      tanggal_berkas = ?,
      tahapan_sidang = ?,
      tanggal_sidang = ?,
      jaksa_id = ?,
      jaksa_kedua_id = ?,
      tu_id = ?,
      habis_penahanan = ?
    WHERE id = ?
  `;

  connection.query(
    sql,
    [
      data.nama_tersangka,
      data.tahapan_berkas,
      data.tanggal_berkas,
      data.tahapan_sidang,
      data.tanggal_sidang,
      data.jaksa_id,
      data.jaksa_kedua_id,
      data.tu_id,
      data.habis_penahanan,
      id
    ],
    callback
  );
};

exports.delete = (id, callback) => {
  connection.query('DELETE FROM perkara WHERE id = ?', [id], callback);
};

exports.getByJaksaId = (jaksaId, callback) => {
  connection.query('SELECT * FROM perkara WHERE jaksa_id = ?', [jaksaId], callback);
};
exports.getByTuId = (tuId, callback) => {
  connection.query('SELECT * FROM perkara WHERE tu_id = ?', [tuId], callback);
};
exports.getByJaksaKeduaId = (jaksaKeduaId, callback) => {
  connection.query('SELECT * FROM perkara WHERE jaksa_kedua_id = ?', [jaksaKeduaId], callback);
};  
exports.getByTanggalBerkas = (tanggal, callback) => {
  connection.query('SELECT * FROM perkara WHERE DATE(tanggal_berkas) = ?', [tanggalBerkas], callback);
};
exports.getByTanggalRange = (startDate, endDate, callback) => {
  connection.query(
    'SELECT * FROM perkara WHERE tanggal_sidang BETWEEN ? AND ?',
    [startDate, endDate],
    callback
  );
};
exports.getByHabisPenahanan = (habisPenahanan, callback) => {
  connection.query('SELECT * FROM perkara WHERE habis_penahanan = ?', [habisPenahanan], callback);
};
exports.getByTanggalSidang = (tanggalSidang, callback) => {
  connection.query('SELECT * FROM perkara WHERE DATE(tanggal_sidang) = ?', [tanggalSidang], callback);
};
exports.getByTanggalSidangRange = (startDate, endDate, callback) => {                           
  connection.query(
    'SELECT * FROM perkara WHERE tanggal_sidang BETWEEN ? AND ?',
    [startDate, endDate],
    callback
  );
};
