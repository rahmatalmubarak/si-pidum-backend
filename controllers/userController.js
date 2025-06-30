const userModel = require('../models/userModel');

// GET /users
exports.getAllUsers = (req, res) => {
  userModel.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// GET /users/:id
exports.getUserById = (req, res) => {
  const id = req.params.id;
  userModel.getById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json(results[0]);
  });
};

// POST /users
exports.createUser = (req, res) => {
  const { nama, role, jabatan, foto } = req.body;
  if (!nama || !role || !jabatan) {
    return res.status(400).json({ error: 'Nama, role, dan jabatan wajib diisi' });
  }
  userModel.create({ nama, role, jabatan, foto }, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json(result);
  });
};

// PUT /users/:id
exports.updateUser = (req, res) => {
  const id = req.params.id;
  const { nama, role, jabatan, foto } = req.body;
  if (!nama || !role || !jabatan) {
    return res.status(400).json({ error: 'Nama, role, dan jabatan wajib diisi' });
  }
  userModel.update(id, { nama, role, jabatan, foto }, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json({ message: 'User berhasil diperbarui' });
  });
};

// DELETE /users/:id
exports.deleteUser = (req, res) => {
  const id = req.params.id;
  userModel.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json({ message: 'User berhasil dihapus' });
  });
};
