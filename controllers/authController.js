// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // koneksi mysql2
const { v4: uuidv4 } = require('uuid');
const User = require('../models').User;     // asumsi index.js meng‑export semua model
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET tidak didefinisikan di environment');
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    // validasi input sederhana
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: 'Email dan password wajib diisi',
        });
    }

    try {
        // cari user berdasarkan email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({
                success: false,
                status: 401,
                message: 'Email atau password salah',
            });
        }

        // cocokkan password hash
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({
                success: false,
                status: 401,
                message: 'Email atau password salah',
            });
        }

        // (opsional) buat token JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        await db.query('UPDATE users SET remember_token = ? WHERE id = ?', [token, user.id]);

        // bentuk respons sesuai permintaan
        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Login Berhasil',
            data: {
                id: user.id,
                email: user.email,
                nama: user.nama,
                role: user.role,
                jabatan: user.jabatan,
                noHp: user.no_hp,
                foto: user.foto,
                rememberToken: token,
            },
            token,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            status: 500,
            message: 'Terjadi kesalahan server',
        });
    }
};

exports.logout = async (req, res) => {
    try {
        // Misal user ID didapat dari token atau session (jika pakai middleware autentikasi)
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                status: 401,
                message: 'Token tidak ditemukan',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Set remember_token ke NULL
        await db.query('UPDATE users SET remember_token = NULL WHERE id = ?', [decoded.id]);

        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Logout Berhasil dan remember_token dihapus',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            status: 500,
            message: 'Terjadi kesalahan saat logout',
        });
    }
};


// Registrasi pengguna baru
exports.register = async (req, res) => {
    const {
        nama,
        email,
        password,
        role,
        jabatan,
        no_hp,
        foto
    } = req.body;

    try {
        // 1. Cek apakah email sudah digunakan
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: 'Email sudah terdaftar'
            });
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const id = uuidv4();

        // 3. Simpan ke database
        await db.query(`
      INSERT INTO users (
        id, nama, email, password, role, jabatan, no_hp, foto, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [id, nama, email, hashedPassword, role, jabatan, no_hp, foto || null]);

        // 4. Buat response
        return res.status(200).json({
            success: true,
            status: 200,
            message: 'Registrasi Berhasil',
            data: {
                id,
                nama,
                email,
                role,
                jabatan,
                no_hp,
                foto
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            status: 500,
            message: 'Terjadi kesalahan saat registrasi'
        });
    }
};
