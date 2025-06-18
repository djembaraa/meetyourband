import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, MessageSquare, Heart } from 'lucide-react';
import PostCard from '../components/PostCard';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (page = 1) => {
    try {
      const response = await api.get(`/posts?page=${page}&limit=10`);
      setPosts(response.data.posts);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handlePostDelete = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Connect with Musicians Worldwide
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Share your music journey, find band members, and discuss everything music
        </p>
        
        {!user && (
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
              Join the Community
            </Link>
            <Link to="/login" className="btn btn-secondary text-lg px-8 py-3">
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card p-6 text-center">
          <Users className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">1,000+</h3>
          <p className="text-gray-600">Musicians</p>
        </div>
        <div className="card p-6 text-center">
          <MessageSquare className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">5,000+</h3>
          <p className="text-gray-600">Discussions</p>
        </div>
        <div className="card p-6 text-center">
          <Heart className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">10,000+</h3>
          <p className="text-gray-600">Connections Made</p>
        </div>
      </div>

      {/* Create Post CTA */}
      {user && (
        <div className="card p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Plus className="h-6 w-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Share your music story</h3>
              <p className="text-gray-600">What's on your mind, {user.username}?</p>
            </div>
            <Link to="/create-post" className="btn btn-primary">
              Create Post
            </Link>
          </div>
        </div>
      )}

      {/* Posts Feed */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Latest Discussions</h2>
        </div>

        {posts.length === 0 ? (
          <div className="card p-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-4">Be the first to start a discussion!</p>
            {user && (
              <Link to="/create-post" className="btn btn-primary">
                Create First Post
              </Link>
            )}
          </div>
        ) : (
          posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onPostDelete={handlePostDelete}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchPosts(page)}
                className={`px-4 py-2 rounded-md ${
                  page === pagination.page
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;