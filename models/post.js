const db = require('../db');

exports.createPost = (userId, title, content, callback) => {
  db.query('INSERT INTO Posts (userId, title, content) VALUES (?, ?, ?)', [userId, title, content], callback);
};

exports.getAllPosts = (callback) => {
  db.query('SELECT * FROM Posts', (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results);
  });
};

exports.getPostById = (postId, callback) => {
  db.query('SELECT * FROM Posts WHERE id = ?', [postId], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, results[0]);
  });
};

exports.updatePost = (postId, title, content, callback) => {
  db.query('UPDATE Posts SET title = ?, content = ? WHERE id = ?', [title, content, postId], callback);
};

exports.deletePost = (postId, callback) => {
  db.query('DELETE FROM Posts WHERE id = ?', [postId], callback);
};