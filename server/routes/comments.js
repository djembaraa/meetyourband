const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get comments for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const comments = await db('comments')
      .select(
        'comments.*',
        'users.username',
        'users.profile_picture'
      )
      .join('users', 'comments.user_id', 'users.id')
      .where('comments.post_id', postId)
      .orderBy('comments.created_at', 'asc')
      .limit(limit)
      .offset(offset);

    const totalComments = await db('comments')
      .where({ post_id: postId })
      .count('* as count')
      .first();

    res.json({
      comments,
      pagination: {
        page,
        limit,
        total: parseInt(totalComments.count),
        pages: Math.ceil(totalComments.count / limit)
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create comment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { post_id, content } = req.body;
    const userId = req.user.id;

    if (!post_id || !content) {
      return res.status(400).json({ message: 'Post ID and content are required' });
    }

    // Check if post exists
    const post = await db('posts').where({ id: post_id }).first();
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const [commentId] = await db('comments').insert({
      post_id,
      user_id: userId,
      content
    }).returning('id');

    const comment = await db('comments')
      .select(
        'comments.*',
        'users.username',
        'users.profile_picture'
      )
      .join('users', 'comments.user_id', 'users.id')
      .where('comments.id', commentId.id || commentId)
      .first();

    res.status(201).json({
      message: 'Comment created successfully',
      comment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update comment
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await db('comments').where({ id }).first();

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    await db('comments').where({ id }).update({
      content,
      updated_at: db.fn.now()
    });

    const updatedComment = await db('comments')
      .select(
        'comments.*',
        'users.username',
        'users.profile_picture'
      )
      .join('users', 'comments.user_id', 'users.id')
      .where('comments.id', id)
      .first();

    res.json({
      message: 'Comment updated successfully',
      comment: updatedComment
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete comment
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await db('comments').where({ id }).first();

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await db('comments').where({ id }).del();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/Unlike comment
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await db('comments').where({ id }).first();
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const existingLike = await db('likes')
      .where({ user_id: userId, comment_id: id })
      .first();

    if (existingLike) {
      // Unlike
      await db('likes').where({ user_id: userId, comment_id: id }).del();
      await db('comments').where({ id }).decrement('likes_count', 1);
      
      res.json({ message: 'Comment unliked', liked: false });
    } else {
      // Like
      await db('likes').insert({ user_id: userId, comment_id: id });
      await db('comments').where({ id }).increment('likes_count', 1);
      
      res.json({ message: 'Comment liked', liked: true });
    }
  } catch (error) {
    console.error('Like comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;