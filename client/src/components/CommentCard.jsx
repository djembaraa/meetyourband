import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, User, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const CommentCard = ({ comment, onCommentUpdate, onCommentDelete }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likes_count);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like comments');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/comments/${comment.id}/like`);
      setLiked(response.data.liked);
      setLikesCount(prev => response.data.liked ? prev + 1 : prev - 1);
    } catch (error) {
      toast.error('Failed to like comment');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      const response = await api.put(`/comments/${comment.id}`, {
        content: editContent
      });
      
      if (onCommentUpdate) {
        onCommentUpdate(response.data.comment);
      }
      
      setIsEditing(false);
      toast.success('Comment updated successfully');
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await api.delete(`/comments/${comment.id}`);
      toast.success('Comment deleted successfully');
      if (onCommentDelete) {
        onCommentDelete(comment.id);
      }
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            {comment.profile_picture ? (
              <img 
                src={comment.profile_picture} 
                alt={comment.username}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <User className="h-4 w-4 text-primary-600" />
            )}
          </div>
          <div>
            <h5 className="font-medium text-gray-900 text-sm">{comment.username}</h5>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Actions for comment owner */}
        {user && user.id === comment.user_id && (
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
            >
              <Edit className="h-3 w-3" />
            </button>
            <button 
              onClick={handleDelete}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="mb-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="textarea w-full text-sm"
            rows="3"
          />
          <div className="flex items-center space-x-2 mt-2">
            <button
              onClick={handleEdit}
              className="btn btn-primary text-xs px-3 py-1"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditContent(comment.content);
              }}
              className="btn btn-secondary text-xs px-3 py-1"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700 text-sm leading-relaxed mb-3">{comment.content}</p>
      )}

      {/* Actions */}
      <div className="flex items-center">
        <button
          onClick={handleLike}
          disabled={loading}
          className={`flex items-center space-x-1 px-2 py-1 rounded-full transition-colors text-xs ${
            liked 
              ? 'text-red-600 bg-red-50 hover:bg-red-100' 
              : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
          }`}
        >
          <Heart className={`h-3 w-3 ${liked ? 'fill-current' : ''}`} />
          <span className="font-medium">{likesCount}</span>
        </button>
      </div>
    </div>
  );
};

export default CommentCard;