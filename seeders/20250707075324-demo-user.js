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
        '0895600632876',
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
        '0895600632876',
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
        '0895600632876',
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
        '0895600632876',
        null,
        now,
        now,
      ],
      [
        uuidv4(),
        'Herma Desvira, S.H.',
        'herma.desvira@kejaksaan.go.id',
        password,
        'tata_usaha',
        'Staf Pidum',
        '0895600632876',
        null,
        now,
        now,
      ],
      [
        uuidv4(),
        'Rafi Pratama Akhlin, S.H.',
        'rafi.pratma.akhlin@kejaksaan.go.id',
        password,
        'tata_usaha',
        'Staf Pidum',
        '081268159059'
      ],
      [
        uuidv4(),
        'Noviana, A.Md.Kom',
        'noviana@kejaksaan.go.id',
        password,
        'tata_usaha',
        'Staf Pidum',
        '081268159059'
      ],
      [
        uuidv4(),
        'Randu Fascal',
        'randu.fascal@kejaksaan.go.id',
        password,
        'tata_usaha',
        'Staf Pidum',
        '081268159059'
      ],
      [
        uuidv4(),
        'Ardian Waskita Nugraha',
        'Ardian.waskita.nugraha@kejaksaan.go.id',
        password,
        'tata_usaha',
        'Staf Pidum',
        '081268159059'
      ],
      [
        uuidv4(),
        'Syahnia Chairunnisa, A.Md.',
        'syahnia.chairunnisa@kejaksaan.go.id',
        password,
        'tata_usaha',
        'Staf Pidum',
        '081268159059'
      ],
      [
        uuidv4(),
        'Elsi Ramadhani, A.Md.',
        'elsi.ramadhani@kejaksaan.go.id',
        password,
        'tata_usaha',
        'Staf Barang Bukti',
        '081268159059'
      ],
      [
        uuidv4(),
        'Rahmat Almubarak, A.Md.T',
        'rahmat.almubarak@kejaksaan.go.id',
        password,
        'tata_usaha',
        'Staf Barang Bukti',
        '081268159059'
      ]
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
