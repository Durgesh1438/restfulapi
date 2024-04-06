const Post = require('../models/post');

exports.createPost = (req, res) => {
  const { title, content } = req.body;
  const userId = req.userId; 
  Post.createPost(userId, title, content, (err) => {
    if (err) {
      console.error('Error creating post:', err);
      res.status(500).json({ error: 'Error creating post' });
      return;
    }
    res.status(201).json({ message: 'Post created successfully' });
  });
};

exports.getAllPosts = (req, res) => {
  Post.getAllPosts((err, posts) => {
    if (err) {
      console.error('Error fetching posts:', err);
      res.status(500).json({ error: 'Error fetching posts' });
      return;
    }
    res.json(posts);
  });
};

exports.getPostById = (req, res) => {
  const postId = req.params.id;
  Post.getPostById(postId, (err, post) => {
    if (err) {
      console.error('Error fetching post:', err);
      res.status(500).json({ error: 'Error fetching post' });
      return;
    }
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.json(post);
  });
};

exports.updatePost = (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;
  console.log(title,content)
  
  Post.getPostById(postId, (err, post) => {
    if (err) {
      console.error('Error fetching post:', err);
      res.status(500).json({ error: 'Error fetching post' });
      return;
    }
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    const updatedTitle = (typeof title !== 'undefined' && title.trim() !== '') ? title : post.title;

    
    const updatedContent = (typeof content !== 'undefined') ? content : post.content;
 
   Post.updatePost(postId,updatedTitle,updatedContent, (err) => {
    if (err) {
      console.error('Error updating post:', err);
      res.status(500).json({ error: 'Error updating post' });
      return;
    }
    res.json({ message: 'Post updated successfully' });
  });
  
});

}

exports.deletePost = (req, res) => {
  const postId = req.params.id;
  Post.deletePost(postId, (err) => {
    if (err) {
      console.error('Error deleting post:', err);
      res.status(500).json({ error: 'Error deleting post' });
      return;
    }
    res.json({ message: 'Post deleted successfully' });
  });
};