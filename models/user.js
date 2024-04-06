const db = require('../db');

exports.createUser = (username, password, callback) => {
  db.query('INSERT INTO Users (username, password) VALUES (?, ?)', [username, password], callback);
};

exports.getUserByUsername = (username, callback) => {
  db.query('SELECT * FROM Users WHERE username = ?', [username], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results[0]);
  });
};

exports.getUserById = (userId, callback) => {
  db.query('SELECT * FROM Users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results[0]);
  });
};

exports.updateUser = (userId, username, password, callback) => {
  db.query('UPDATE Users SET username = ?, password = ? WHERE id = ?', [username, password, userId], callback);
};

exports.deleteUser = (userId, callback) => {
  db.query('DELETE FROM Users WHERE id = ?', [userId], callback);
};
exports.updateUserRole = (userId, newRole, callback) => {
    db.query('UPDATE Users SET role = ? WHERE id = ?', [newRole, userId], callback);
  };
exports.getAllUsers = (callback) => {
    db.query('SELECT id, username, role FROM Users', (err, results) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, results);
    });
  };