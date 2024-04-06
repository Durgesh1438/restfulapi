const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');
const { isAdmin,verifyToken } = require('../middlewares/authMiddleware');

// Create a new post (protected route)
router.post('/', verifyToken, PostController.createPost);

// Get all posts
router.get('/',verifyToken,isAdmin, PostController.getAllPosts);

// Get post by ID
router.get('/:id', PostController.getPostById);

// Update post by ID (protected route)
router.put('/:id', verifyToken, PostController.updatePost);

// Delete post by ID (protected route)
router.delete('/:id', verifyToken, PostController.deletePost);

module.exports = router;