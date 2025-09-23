'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentApi } from '@/lib/api';
import { getImageUrl, formatDate } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import AuthPrompt from '@/components/auth/AuthPrompt';

interface ContentCommentsProps {
  contentId: number;
}

const ContentComments = ({ contentId }: ContentCommentsProps) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated } = useAppStore();
  const queryClient = useQueryClient();

  // Fetch comments
  const { data: commentsData, isLoading } = useQuery({
    queryKey: ['content-comments', contentId],
    queryFn: async () => {
      const response = await contentApi.getComments(contentId, 0, 20);
      return response.data;
    },
    enabled: !!contentId,
  });

  // Submit comment mutation
  const submitCommentMutation = useMutation({
    mutationFn: async (comment: string) => {
      const response = await contentApi.submitComment(contentId, {
        description: comment,
        rating: 5, // Default rating
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-comments', contentId] });
      setNewComment('');
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error('Failed to submit comment:', error);
      setIsSubmitting(false);
    },
  });

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;

    setIsSubmitting(true);
    submitCommentMutation.mutate(newComment);
  };

  const comments = commentsData?.records || [];

  return (
    <div className="mt-8 border-t border-gray-200 pt-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        评论({comments.length})
      </h3>

      {/* Comment Form - Only for logged in users */}
      {isAuthenticated ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="flex items-start gap-3">
              <img
                src={getImageUrl(user?.profilePhotoSmall)}
                alt={user?.username || 'User'}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hidden">
                <span className="text-gray-500 text-sm font-medium">
                  {user?.username?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="写下你的评论..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  disabled={isSubmitting}
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={!newComment.trim() || isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isSubmitting ? '提交中...' : '发表评论'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      ) : (
        <div className="mb-8">
          <AuthPrompt />
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>暂无评论，成为第一个评论的人吧！</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              <img
                src={getImageUrl(comment.userId ? `/api/v1/user/${comment.userId}/avatar` : null)}
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hidden">
                <span className="text-gray-500 text-sm font-medium">U</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-gray-900">
                    用户{comment.userId}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(comment.createTime)}
                  </span>
                  {comment.rating && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-500">评分:</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < comment.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {comment.description}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContentComments;
