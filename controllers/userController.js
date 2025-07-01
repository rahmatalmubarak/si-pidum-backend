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
  const { nama, email, role, jabatan, foto, password } = req.body;
  if (!nama || !email || !role || !jabatan || !password) {
    return res.status(400).json({ error: 'Nama, email, role, jabatan, dan password wajib diisi' });
  }
  userModel.create({ nama, email, role, jabatan, foto, password }, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json(result);
  });
};

// PUT /users/:id
exports.updateUser = (req, res) => {
  const id = req.params.id;
  const { nama, email, role, jabatan, foto, password } = req.body;
  if (!nama || !email || !role || !jabatan) {
    return res.status(400).json({ error: 'Nama, email, role, dan jabatan wajib diisi' });
  }
  userModel.update(id, { nama, email, role, jabatan, foto, password }, (err, result) => {
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

// POST /users/login
exports.login = (req, res) => {
  const { email, password } = req.body;
  // Implementasi login logika di sini
  userModel.login(email, password, (err, user) => {
    if (err) return res.status(500).json({ error: err });
    if (!user) return res.status(401).json({ message: 'Email atau password salah' });
    // Simpan informasi user di session atau token
    const { nama, role, jabatan, foto } = user;
    res.status(200).json({ success: true, message: 'Login berhasil', user: { email, nama, role, jabatan, foto } });
  });
}

exports.logout = (req, res) => {
  const userId = req.body.userId; // Ambil userId dari request body
  // Implementasi logout logika di sini
  userModel.logout(userId, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json({ success: true, message: 'Logout Berhasil', result });
  });
}