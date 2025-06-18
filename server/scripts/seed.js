const bcrypt = require('bcryptjs');
const db = require('../config/database');

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await db('likes').del();
    await db('comments').del();
    await db('posts').del();
    await db('users').del();

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const users = [
      {
        username: 'rockstar_mike',
        email: 'mike@example.com',
        password: hashedPassword,
        bio: 'Lead guitarist looking for a band to rock the world! 🎸'
      },
      {
        username: 'drummer_sarah',
        email: 'sarah@example.com',
        password: hashedPassword,
        bio: 'Professional drummer with 10+ years experience. Let\'s make some noise! 🥁'
      },
      {
        username: 'bass_player_joe',
        email: 'joe@example.com',
        password: hashedPassword,
        bio: 'Bass player who loves funk, rock, and everything in between 🎵'
      },
      {
        username: 'vocalist_emma',
        email: 'emma@example.com',
        password: hashedPassword,
        bio: 'Singer-songwriter looking to collaborate with talented musicians ✨'
      }
    ];

    const insertedUsers = await db('users').insert(users).returning('*');
    console.log(`✅ Created ${insertedUsers.length} users`);

    // Create sample posts
    const posts = [
      {
        user_id: insertedUsers[0].id,
        title: 'Looking for a drummer for our rock band!',
        content: 'Hey everyone! Our rock band "Electric Storm" is looking for a talented drummer to complete our lineup. We play classic rock with a modern twist. Must be available for weekend gigs and weekly practice sessions. Hit me up if you\'re interested! 🤘',
        likes_count: 5
      },
      {
        user_id: insertedUsers[1].id,
        title: 'New drum kit setup - what do you think?',
        content: 'Just got my new Pearl drum kit set up in the studio! The sound is absolutely incredible. Added some new cymbals and a double bass pedal. Can\'t wait to jam with this setup. Any other drummers here? Would love to hear about your setups!',
        likes_count: 12
      },
      {
        user_id: insertedUsers[2].id,
        title: 'Bass line for "Come As You Are" - Tutorial',
        content: 'Hey bass players! I just recorded a tutorial for the iconic bass line from Nirvana\'s "Come As You Are". It\'s a great song for beginners to intermediate players. The key is in the timing and that distinctive tone. Let me know if you want me to break down any other classic bass lines!',
        likes_count: 8
      },
      {
        user_id: insertedUsers[3].id,
        title: 'Open mic night this Friday!',
        content: 'There\'s an open mic night this Friday at The Blue Note downtown. I\'ll be performing some original songs around 9 PM. Would love to see some familiar faces from the community there! Who else is planning to perform?',
        likes_count: 15
      },
      {
        user_id: insertedUsers[0].id,
        title: 'Guitar effects pedal recommendations?',
        content: 'I\'m looking to expand my pedalboard and need some recommendations. Currently have a basic overdrive and delay pedal, but want to add more texture to my sound. What are your must-have pedals? Budget is around $300.',
        likes_count: 7
      }
    ];

    const insertedPosts = await db('posts').insert(posts).returning('*');
    console.log(`✅ Created ${insertedPosts.length} posts`);

    // Create sample comments
    const comments = [
      {
        post_id: insertedPosts[0].id,
        user_id: insertedUsers[1].id,
        content: 'I might be interested! I have experience with rock and metal. Can you tell me more about your practice schedule?',
        likes_count: 2
      },
      {
        post_id: insertedPosts[0].id,
        user_id: insertedUsers[3].id,
        content: 'Electric Storm is a great band name! Good luck finding your drummer 🥁',
        likes_count: 1
      },
      {
        post_id: insertedPosts[1].id,
        user_id: insertedUsers[0].id,
        content: 'That kit looks amazing! Pearl makes some of the best drums. How does it sound in the mix?',
        likes_count: 3
      },
      {
        post_id: insertedPosts[2].id,
        user_id: insertedUsers[0].id,
        content: 'Great tutorial! That bass line is so iconic. Could you do one for "Seven Nation Army" next?',
        likes_count: 4
      },
      {
        post_id: insertedPosts[3].id,
        user_id: insertedUsers[2].id,
        content: 'I\'ll definitely be there! Planning to play a few covers. Break a leg! 🎤',
        likes_count: 2
      }
    ];

    const insertedComments = await db('comments').insert(comments).returning('*');
    console.log(`✅ Created ${insertedComments.length} comments`);

    // Create sample likes
    const likes = [
      // Post likes
      { user_id: insertedUsers[1].id, post_id: insertedPosts[0].id },
      { user_id: insertedUsers[2].id, post_id: insertedPosts[0].id },
      { user_id: insertedUsers[3].id, post_id: insertedPosts[0].id },
      { user_id: insertedUsers[0].id, post_id: insertedPosts[1].id },
      { user_id: insertedUsers[2].id, post_id: insertedPosts[1].id },
      { user_id: insertedUsers[3].id, post_id: insertedPosts[1].id },
      // Comment likes
      { user_id: insertedUsers[0].id, comment_id: insertedComments[0].id },
      { user_id: insertedUsers[2].id, comment_id: insertedComments[2].id }
    ];

    await db('likes').insert(likes);
    console.log(`✅ Created ${likes.length} likes`);

    console.log('🎉 Database seeded successfully!');
    console.log('\n📝 Sample login credentials:');
    console.log('Email: mike@example.com | Password: password123');
    console.log('Email: sarah@example.com | Password: password123');
    console.log('Email: joe@example.com | Password: password123');
    console.log('Email: emma@example.com | Password: password123');

  } catch (error) {
    console.error('❌ Seed error:', error);
  } finally {
    await db.destroy();
  }
}

seed();