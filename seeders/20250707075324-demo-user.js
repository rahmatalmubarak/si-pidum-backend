const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db'); // mysql2/promise

async function seedUsers() {
  try {
    const password = await bcrypt.hash('password123', 10);
    const now = new Date();

    const users = [];

    // 10 Tata Usaha
    for (let i = 1; i <= 10; i++) {
      users.push([
        uuidv4(),
        `Tata Usaha ${i}`,
        `tu${i}@mail.com`,
        password,
        'tata_usaha',
        'Staf TU',
        `0812345678${i}`,
        null,
        now,
        now,
      ]);
    }

    // 2 Jaksa
    for (let j = 1; j <= 2; j++) {
      users.push([
        uuidv4(),
        `Jaksa ${j}`,
        `jaksa${j}@mail.com`,
        password,
        'jaksa',
        'Jaksa Penuntut Umum',
        `0898765432${j}`,
        null,
        now,
        now,
      ]);
    }

    const query = `
      INSERT INTO users (
        id, nama, email, password, role, jabatan, no_hp, foto, created_at, updated_at
      ) VALUES ?
    `;

    await db.query(query, [users]);
    console.log('✅ Seeder berhasil dijalankan: 12 user dimasukkan.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Gagal menjalankan seeder:', error);
    process.exit(1);
  }
}

seedUsers();
