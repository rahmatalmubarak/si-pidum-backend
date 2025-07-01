const connection = require('../config/db');

exports.getAll = (callback) => {
  connection.query('SELECT * FROM users', callback);
};

exports.getById = (id, callback) => {
  connection.query('SELECT * FROM users WHERE id = ?', [id], callback);
};

exports.create = (data, callback) => {
  const { nama, role, jabatan, foto } = data;
  connection.query(
    'INSERT INTO users (nama, role, jabatan, foto) VALUES (?, ?, ?, ?)',
    [nama, role, jabatan, foto],
    (err, result) => {
      if (err) return callback(err);
      callback(null, { id: result.insertId, ...data });
    }
  );
};

exports.update = (id, data, callback) => {
  const { nama, role, jabatan, foto } = data;
  connection.query(
    'UPDATE users SET nama = ?, role = ?, jabatan = ?, foto = ? WHERE id = ?',
    [nama, role, jabatan, foto, id],
    (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    }
  );
};

exports.delete = (id, callback) => {
  connection.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
    if (err) return callback(err);
    callback(null, { affectedRows: result.affectedRows });
  });
}

exports.login = (email, password, callback) => {
  connection.query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(null, null);
      callback(null, results[0]);
    }
  );
};

exports.logout = (userId, callback) => {
  // Implementasi logout logika di sini

  // Misalnya, menghapus sesi atau token yang terkait dengan userId
  callback(null, { message: 'User berhasil logout' });
}

exports.register = (data, callback) => {
  const { nama, email, password, role, jabatan, foto } = data;
  connection.query(
    'INSERT INTO users (nama, email, password, role, jabatan, foto) VALUES (?, ?, ?, ?, ?, ?)',
    [nama, email, password, role, jabatan, foto],
    (err, result) => {
      if (err) return callback(err);
      callback(null, { id: result.insertId, ...data });
    }
  );
}


/*exports.delete = (id, callback) => {
  connection.query('DELETE FROM users WHERE id = ?', [id], callback);
};*/
