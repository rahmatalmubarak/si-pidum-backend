require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Expo } = require('expo-server-sdk');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const perkaraRoutes = require('./routes/perkaraRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// === Simpan token notifikasi di memori (sementara) ===
let expoPushTokens = [];

// === ROUTES UTAMA ===
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', perkaraRoutes);

// === ENDPOINT SIMPAN TOKEN ===
app.post('/api/store-token', (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token is required' });

    if (!expoPushTokens.includes(token) && Expo.isExpoPushToken(token)) {
        expoPushTokens.push(token);
        console.log('✅ Token disimpan:', token);
    }

    res.json({ success: true });
});

// === ENDPOINT KIRIM NOTIFIKASI ===
app.post('/api/send-notification', async (req, res) => {
    const expo = new Expo();

    const messages = expoPushTokens.map(token => ({
        to: token,
        sound: 'default',
        title: req.body.title || 'Pengingat Sidang',
        body: req.body.body || 'Ada agenda sidang 2 hari lagi!',
        data: req.body.data || {},
    }));

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    try {
        for (let chunk of chunks) {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        }
        res.json({ success: true, tickets });
    } catch (error) {
        console.error('❌ Gagal kirim notifikasi:', error);
        res.status(500).json({ error: 'Gagal kirim notifikasi' });
    }
});

app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
);
