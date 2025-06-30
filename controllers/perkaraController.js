const e = require('express');
const perkaraModel = require('../models/perkaraModel');

exports.getAllPerkara = (req, res) => {
  perkaraModel.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getPerkaraById = (req, res) => {
  const id = req.params.id;
  perkaraModel.getById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) {
      return res.status(404).json({ message: 'Data perkara tidak ditemukan.' });
    }
    res.json(results[0]);
  });
};

exports.createPerkara = (req, res) => {
  const data = req.body;

  if (!data.nama_tersangka || !data.jaksa_id || !data.jaksa_kedua_id || !data.tu_id || !data.habis_penahanan) {
    return res.status(400).json({ error: 'Field wajib tidak boleh kosong.' });
  }

  perkaraModel.create(data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json(result);
  });
};

exports.updatePerkara = (req, res) => {
  const id = req.params.id;
  const data = req.body;

  perkaraModel.update(id, data, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data perkara tidak ditemukan.' });
    }
    res.json({ message: 'Data perkara berhasil diupdate.' });
  });
};

exports.deletePerkara = (req, res) => {
  const id = req.params.id;
  perkaraModel.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data perkara tidak ditemukan.' });
    }
    res.json({ message: 'Data perkara berhasil dihapus.' });
  });
};

exports.getPerkaraByJaksa = (req, res) => {
  const jaksaId = req.params.jaksaId;
  perkaraModel.getByJaksa(jaksaId, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
}; 

exports.getPerkaraByTu = (req, res) => {
  const tuId = req.params.tuId;
  perkaraModel.getByTu(tuId, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getPerkaraByJaksaKedua = (req, res) => {
  const jaksaKeduaId = req.params.jaksaKeduaId;
  perkaraModel.getByJaksaKedua(jaksaKeduaId, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getPerkaraByTanggal = (req, res) => {
  const tanggal = req.params.tanggal;
  perkaraModel.getByTanggal(tanggal, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getPerkaraByTahapan = (req, res) => {
  const tahapan = req.params.tahapan;
  perkaraModel.getByTahapan(tahapan, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getPerkaraByHabisPenahanan = (req, res) => {
  const habisPenahanan = req.params.habisPenahanan;
  perkaraModel.getByHabisPenahanan(habisPenahanan, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};
exports.getPerkaraByNamaTersangka = (req, res) => {
  const namaTersangka = req.params.namaTersangka;
  perkaraModel.getByNamaTersangka(namaTersangka, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};
exports.getPerkaraByTanggalSidang = (req, res) => {
  const tanggalSidang = req.params.tanggalSidang;
  perkaraModel.getByTanggalSidang(tanggalSidang, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};
exports.getPerkaraByTahapanSidang = (req, res) => {
  const tahapanSidang = req.params.tahapanSidang;
  perkaraModel.getByTahapanSidang(tahapanSidang, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};
exports.getPerkaraByTanggalRange = (req, res) => {
  const { startDate, endDate } = req.query;
  perkaraModel.getByTanggalRange(startDate, endDate, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
}   
exports.getPerkaraByTanggalBerkas = (req, res) => {
  const tanggalBerkas = req.params.tanggalBerkas;
  perkaraModel.getByTanggalBerkas(tanggalBerkas, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};  
