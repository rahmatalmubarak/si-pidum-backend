const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db'); // mysql2/promise

async function seedUsers() {
  try {
    const password = await bcrypt.hash('pangkalan123', 10);
    const now = new Date();

    const users = [
      [
        uuidv4(),
        'Dhipo Akhmadsyah Sembiring, S. H, M. H',
        'dhipo.akhmadsyah.sembiring@kejaksaan.go.id',
        password,
        'jaksa',
        'Kacab Pangkalan',
        '0000000000000',
        null,
        now,
        now,
      ],
      [
        uuidv4(),
        'Annisa Syahwitri, S.H.',
        'annisa.syahwitri@kejaksaan.go.id',
        password,
        'jaksa',
        'Jaksa Fungsional',
        '0000000000000',
        null,
        now,
        now,
      ],
      [
        uuidv4(),
        'Adilla Mamega Sari, S.H.',
        'adilla.mamega.sari@kejaksaan.go.id',
        password,
        'jaksa',
        'Jaksa Fungsional',
        '0000000000000',
        null,
        now,
        now,
      ],
      [
        uuidv4(),
        'Winalia Oktora, S.H.',
        'winalia.oktora@kejaksaan.go.id',
        password,
        'jaksa',
        'Jaksa Fungsional',
        '0000000000000',
        null,
        now,
        now,
      ],
      [
        uuidv4(),
        'Herma Desvira, S.H.',
        'herma.desvira@kejaksaan.go.id',
        password,
        'jaksa',
        'Cajak | Staf Pidum',
        '0000000000000',
        null,
        now,
        now,
      ],
      [
        uuidv4(),
        'Rafi Pratama Akhlin, S.H.',
        'rafi.pratma.akhlin@kejaksaan.go.id',
        password,
        'jaksa',
        'Cajak | Staf Pidum',
        '0000000000000',
        null,
        now,
        now,
      ],
      [
        uuidv4(),
        'Rangga Fajri Pratama, S.H.',
        'rangga.fajri.pratama@kejaksaan.go.id',
        password,
        'jaksa',
        'Cajak | Staf Intelijen',
        '0000000000000',
        null,
        now,
        now,
      ],
      [
        uuidv4(),
        'Noviana, A.Md.Kom',
        'noviana@kejaksaan.go.id',
        password,
        'jaksa',
        'Staf Pidum',
        '0000000000000',
        null,
        now,
        now,
      ],
      [
        uuidv4(),
        'Randu Fascal',
        'randu.fascal@kejaksaan.go.id',
        password,
        'tata_usaha',
        'Staf Pidum',
        '0000000000000',
        null,
        now,
        now,
      ],
      [
        uuidv4(),
        'Furqani Iqbal Syabirin',
        'furqani.iqbal.syabirin@kejaksaan.go.id',
        password,
        'tata_usaha',
        'Pengawal Tahanan',
        '0000000000000',
        null,
        now,
        now,
      ],
      [
        uuidv4(),
        'Ardian Waskita Nugraha',
        'ardian.waskita.nugraha@kejaksaan.go.id',
        password,
        'tata_usaha',
        'Staf Pidum',
        '0000000000000',
        null,
        now,
        now,
      ],
      [
        uuidv4(),
        'Galuh Brajamusti Adi',
        'galuh.brajamusti.adi@kejaksaan.go.id',
        password,
        'tata_usaha',
        'Pengawal Tahanan',
        '0000000000000',
        null,
        now,
        now,
      ],
      [
        uuidv4(),
        'Syahnia Chairunnisa, A.Md.',
        'syahnia.chairunnisa@kejaksaan.go.id',
        password,
        'tata_usaha',
        'Staf Pidum',
        '0000000000000',
        null,
        now,
        now,
      ],
      [
        uuidv4(),
        'Elsi Ramadhani, A.Md.',
        'elsi.ramadhani@kejaksaan.go.id',
        password,
        'tata_usaha',
        'Staf Barang Bukti',
        '0000000000000',
        null,
        now,
        now,
      ],
      [
        uuidv4(),
        'Rahmat Almubarak, A.Md.T',
        'rahmat.almubarak@kejaksaan.go.id',
        password,
        'tata_usaha',
        'Staf Barang Bukti',
        '0000000000000',
        null,
        now,
        now,
      ],

    ];

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
