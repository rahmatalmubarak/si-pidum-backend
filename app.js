require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', userRoutes);

app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
);
