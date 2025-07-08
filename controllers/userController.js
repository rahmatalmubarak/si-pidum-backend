const bcrypt = require('bcrypt');
const db = require('../config/db'); // koneksi mysql2
const userModel = require('../models/users');

exports.getAllUsers = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        id, nama, email, role, jabatan, no_hp AS noHp, foto, remember_token AS rememberToken, created_at 
      FROM users
      ORDER BY created_at DESC
    `);

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Berhasil menampilkan semua user",
      data: results,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: 'Gagal mengambil data user',
    });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    nama,
    email,
    password,
    role,
    jabatan,
    noHp,
    foto
  } = req.body;

  try {
    const [userCheck] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (userCheck.length === 0) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'User tidak ditemukan',
      });
    }

    let hashedPassword = userCheck[0].password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await db.query(`
      UPDATE users SET 
        nama = ?, email = ?, password = ?, role = ?, jabatan = ?, no_hp = ?, foto = ?, updated_at = NOW()
      WHERE id = ?
    `, [nama, email, hashedPassword, role, jabatan, noHp, foto, id]);

    const [updatedUserRows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    const updatedUser = updatedUserRows[0];

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'Ubah Data Berhasil',
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        nama: updatedUser.nama,
        role: updatedUser.role,
        jabatan: updatedUser.jabatan,
        noHp: updatedUser.no_hp,
        foto: updatedUser.foto,
        rememberToken: updatedUser.remember_token,
        updated_at: updatedUser.updated_at
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      status: 500,
      message: 'Terjadi kesalahan saat mengupdate user'
    });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Cek keberadaan user
    const [exist] = await db.query('SELECT id FROM users WHERE id = ?', [id]);
    if (exist.length === 0) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: 'User tidak ditemukan',
      });
    }

    // Hapus user
    await db.query('DELETE FROM users WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'User berhasil dihapus',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      status: 500,
      message: 'Terjadi kesalahan saat menghapus user',
    });
  }
};

exports.getUsersByRole = async (req, res) => {
  const { role } = req.params;

  try {
    const [users] = await db.query('SELECT * FROM users WHERE role = ?', [role]);

    return res.status(200).json({
      success: true,
      status: 200,
      message: `User dengan role ${role}`,
      data: users
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: `Gagal mengambil data user berdasarkan ${role}}`
    });
  }
};
