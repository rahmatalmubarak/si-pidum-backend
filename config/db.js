const mysql = require('mysql2/promise'); // GUNAKAN VERSI PROMISE

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'si_pidum_backend',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
