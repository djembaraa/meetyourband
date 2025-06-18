import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, User, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const PostCard = ({ post, onPostUpdate, onPostDelete }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like posts');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/posts/${post.id}/like`);
      setLiked(response.data.liked);
      setLikesCount(prev => response.data.liked ? prev + 1 : prev - 1);
    } catch (error) {
      toast.error('Failed to like post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await api.delete(`/posts/${post.id}`);
      toast.success('Post deleted successfully');
      if (onPostDelete) {
        onPostDelete(post.id);
      }
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  return (
    <div className="card p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            {post.profile_picture ? (
              <img 
                src={post.profile_picture} 
                alt={post.username}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-primary-600" />
            )}
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{post.username}</h4>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Actions for post owner */}
        {user && user.id === post.user_id && (
          <div className="flex items-center space-x-2">
            <button className="p-1 text-gray-400 hover:text-primary-600 transition-colors">
              <Edit className="h-4 w-4" />
            </button>
            <button 
              onClick={handleDelete}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
        <p className="text-gray-700 leading-relaxed">{post.content}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            disabled={loading}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-colors ${
              liked 
                ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{likesCount}</span>
          </button>

          <Link
            to={`/post/${post.id}`}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-medium">{post.comments_count}</span>
          </Link>
        </div>

        <Link
          to={`/post/${post.id}`}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View Discussion
        </Link>
      </div>
    </div>
  );
};

export default PostCard;