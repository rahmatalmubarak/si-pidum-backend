const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_attorney'
});

connection.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected!.');
  }
});

module.exports = connection;
