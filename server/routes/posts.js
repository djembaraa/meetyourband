const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all posts with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const posts = await db('posts')
      .select(
        'posts.*',
        'users.username',
        'users.profile_picture'
      )
      .join('users', 'posts.user_id', 'users.id')
      .orderBy('posts.created_at', 'desc')
      .limit(limit)
      .offset(offset);

    // Get comments count for each post
    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const commentsCount = await db('comments')
          .where({ post_id: post.id })
          .count('* as count')
          .first();

        return {
          ...post,
          comments_count: parseInt(commentsCount.count)
        };
      })
    );

    const totalPosts = await db('posts').count('* as count').first();

    res.json({
      posts: postsWithCounts,
      pagination: {
        page,
        limit,
        total: parseInt(totalPosts.count),
        pages: Math.ceil(totalPosts.count / limit)
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const post = await db('posts')
      .select(
        'posts.*',
        'users.username',
        'users.profile_picture'
      )
      .join('users', 'posts.user_id', 'users.id')
      .where('posts.id', id)
      .first();

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Get comments count
    const commentsCount = await db('comments')
      .where({ post_id: id })
      .count('* as count')
      .first();

    res.json({
      ...post,
      comments_count: parseInt(commentsCount.count)
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create post
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const [postId] = await db('posts').insert({
      user_id: userId,
      title,
      content
    }).returning('id');

    const post = await db('posts')
      .select(
        'posts.*',
        'users.username',
        'users.profile_picture'
      )
      .join('users', 'posts.user_id', 'users.id')
      .where('posts.id', postId.id || postId)
      .first();

    res.status(201).json({
      message: 'Post created successfully',
      post: {
        ...post,
        comments_count: 0
      }
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update post
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;

    const post = await db('posts').where({ id }).first();

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    await db('posts').where({ id }).update({
      title: title || post.title,
      content: content || post.content,
      updated_at: db.fn.now()
    });

    const updatedPost = await db('posts')
      .select(
        'posts.*',
        'users.username',
        'users.profile_picture'
      )
      .join('users', 'posts.user_id', 'users.id')
      .where('posts.id', id)
      .first();

    res.json({
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete post
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await db('posts').where({ id }).first();

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await db('posts').where({ id }).del();

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/Unlike post
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await db('posts').where({ id }).first();
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const existingLike = await db('likes')
      .where({ user_id: userId, post_id: id })
      .first();

    if (existingLike) {
      // Unlike
      await db('likes').where({ user_id: userId, post_id: id }).del();
      await db('posts').where({ id }).decrement('likes_count', 1);
      
      res.json({ message: 'Post unliked', liked: false });
    } else {
      // Like
      await db('likes').insert({ user_id: userId, post_id: id });
      await db('posts').where({ id }).increment('likes_count', 1);
      
      res.json({ message: 'Post liked', liked: true });
    }
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;