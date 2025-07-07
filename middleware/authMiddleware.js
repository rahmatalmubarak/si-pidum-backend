// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware untuk otentikasi
exports.authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
        req.user = decoded; // simpan data user dari token
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Token tidak valid' });
    }
};

// Middleware khusus admin
exports.onlyAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Akses khusus admin' });
    }
    next();
};
