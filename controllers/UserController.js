const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { errorMonitor } = require('supertest/lib/test');

exports.login = (req, res) => {
  const { username, password } = req.body;
  User.getUserByUsername(username, (err, user) => {
    
    if (err) {
      console.error('Error fetching user:', err);
      res.status(500).json({ error: 'Error fetching user' });
      return;
    }
    if (!user) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        res.status(500).json({ error: 'Error comparing passwords' });
        return;
      }
      if (!result) {
        res.status(401).json({ error: 'Invalid username or password' });
        return;
      }
      if (username === 'admin') {
        // Update the user's role to 'admin' in the database
        const newRole = 'admin';
        User.updateUserRole(user.id, newRole, (err, result) => {
          if (err) {
            console.error('Error updating user role:', err);
            res.status(500).json({ error: 'Error updating user role' });
            return;
          }
          
          // Generate JWT token and send response
          const token = jwt.sign({ userId: user.id, username: user.username,role:newRole}, process.env.JWT_SECRET, { expiresIn: '1h' });
          res.json({ token });
        });
      }  else {
        // Generate JWT token and send response
        const token = jwt.sign({ userId: user.id, username: user.username,role:user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
      }
    });
  });
};

exports.register = (req, res) => {

  const { username, password } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      res.status(500).json({ error: 'Error hashing password' });
      return;
    }
    User.createUser(username, hash, (err) => {
      if (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Error creating user' });
        return;
      }
      res.status(201).json({ message: 'User created successfully' });
    });
  });
};

exports.getProfile = (req, res) => {
  const userId = req.userId;
  User.getUserById(userId, (err, user) => {
    if (err) {
      console.error('Error fetching user profile:', err);
      res.status(500).json({ error: 'Error fetching user profile' });
      return;
    }
    res.json(user);
  });
};

exports.updateProfile = (req, res) => {
  const userId = req.userId;
  const { username, password } = req.body;
  User.getUserById(userId, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching user details' });
    }

    let updatedUser = username || user.username; // Simplified username check
    let updatedPassword = user.password; // Default to current password unless changed

    if (password) {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.error('Error hashing password:', err);
          return res.status(500).json({ error: 'Error hashing password' });
        }
        updatedPassword = hash;
        updateUserDetails();
      });
    } else {
      updateUserDetails();
    }

    function updateUserDetails() {
      User.updateUser(userId, updatedUser, updatedPassword, (err) => {
        if (err) {
          console.error('Error updating user:', err);
          return res.status(500).json({ error: 'Error updating user' });
        }
        res.json({ message: 'User profile updated successfully' });
      });
    }
  });
};

exports.deleteProfile = (req, res) => {
  const userId = req.userId;
  User.deleteUser(userId, (err) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ error: 'Error deleting user' });
      return;
    }
    res.json({ message: 'User profile deleted successfully' });
  });
};

exports.getAllUsers = (req, res) => {
    User.getAllUsers((err, users) => {
      if (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Error fetching users' });
        return;
      }
      res.json(users);
    });
  };