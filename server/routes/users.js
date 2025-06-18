const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await db('users')
      .select('id', 'username', 'email', 'bio', 'profile_picture', 'created_at')
      .where({ id })
      .first();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's posts count
    const postsCount = await db('posts').where({ user_id: id }).count('* as count').first();

    res.json({
      ...user,
      posts_count: parseInt(postsCount.count)
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { username, bio, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const updateData = {};

    // Update username if provided
    if (username && username !== req.user.username) {
      const existingUser = await db('users').where({ username }).first();
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      updateData.username = username;
    }

    // Update bio
    if (bio !== undefined) {
      updateData.bio = bio;
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      const isValidPassword = await bcrypt.compare(currentPassword, req.user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters' });
      }

      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    // Update user
    await db('users').where({ id: userId }).update(updateData);

    // Get updated user
    const updatedUser = await db('users')
      .select('id', 'username', 'email', 'bio', 'profile_picture', 'created_at')
      .where({ id: userId })
      .first();

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;