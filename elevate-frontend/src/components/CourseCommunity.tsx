import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Trash2, User, Smile, Image as ImageIcon, MoreVertical, Loader2 } from 'lucide-react';
import api from '../services/api';

interface Comment {
  id: number;
  content: string;
  user: { name: string };
  created_at: string;
}

interface Post {
  id: number;
  content: string;
  type: 'post' | 'poll';
  user: { id: number; name: string };
  comments: Comment[];
  created_at: string;
}

const CourseCommunity: React.FC<{ courseId: number }> = ({ courseId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeCommentPost, setActiveCommentPost] = useState<number | null>(null);
  const [commentContent, setCommentContent] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchPosts = async () => {
    try {
      const res = await api.get(`/courses/${courseId}/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [courseId]);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    setIsSubmitting(true);
    try {
      await api.post('/posts', {
        course_id: courseId,
        content: newPostContent,
        type: 'post'
      });
      setNewPostContent('');
      fetchPosts();
    } catch (err) {
      console.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateComment = async (postId: number) => {
    if (!commentContent.trim()) return;
    try {
      await api.post('/comments', {
        post_id: postId,
        content: commentContent
      });
      setCommentContent('');
      setActiveCommentPost(null);
      fetchPosts();
    } catch (err) {
      console.error('Failed to create comment');
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنشور؟')) return;
    try {
      await api.delete(`/posts/${id}`);
      fetchPosts();
    } catch (err) {
      console.error('Delete failed');
    }
  };

  return (
    <div className="space-y-8">
      {/* Create Post Area */}
      <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
            {currentUser.name?.charAt(0)}
          </div>
          <div className="flex-1">
            <textarea
              placeholder="بماذا تفكر؟ شارك زملائك..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 resize-none h-24 text-lg"
            />
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white/5 rounded-xl text-gray-400 transition-all"><ImageIcon size={20} /></button>
                <button className="p-2 hover:bg-white/5 rounded-xl text-gray-400 transition-all"><Smile size={20} /></button>
              </div>
              <button
                onClick={handleCreatePost}
                disabled={isSubmitting || !newPostContent.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                نشر
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-blue-500" size={40} /></div>
        ) : (
          posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/[0.07] transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-blue-400 border border-white/5">
                    {post.user.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{post.user.name}</h4>
                    <span className="text-xs text-gray-500 font-mono">
                      {new Date(post.created_at).toLocaleString('ar-EG')}
                    </span>
                  </div>
                </div>
                {(post.user.id === currentUser.id || currentUser.role === 'admin') && (
                  <button 
                    onClick={() => handleDeletePost(post.id)}
                    className="p-2 hover:bg-red-500/10 text-gray-600 hover:text-red-500 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <p className="text-gray-200 leading-relaxed text-lg mb-8">
                {post.content}
              </p>

              <div className="flex items-center gap-6 pt-6 border-t border-white/5">
                <button 
                  onClick={() => setActiveCommentPost(activeCommentPost === post.id ? null : post.id)}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-all"
                >
                  <MessageSquare size={18} />
                  {post.comments.length} تعليقات
                </button>
              </div>

              {/* Comments Section */}
              <AnimatePresence>
                {activeCommentPost === post.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 space-y-4">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 bg-white/5 p-4 rounded-2xl">
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[10px] font-bold">
                            {comment.user.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="text-xs font-bold text-blue-400">{comment.user.name}</span>
                              <span className="text-[10px] text-gray-600">{new Date(comment.created_at).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-sm text-gray-300 mt-1">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                      
                      <div className="flex gap-2 mt-4 pt-4">
                        <input
                          type="text"
                          placeholder="أكتب تعليقك..."
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleCreateComment(post.id)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button 
                          onClick={() => handleCreateComment(post.id)}
                          className="p-2 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition-all"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseCommunity;
