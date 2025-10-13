'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { postApi, userApi } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import { PostDTO } from '@/types';
import { formatDateTime } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ProfilePage() {
  const { user } = useAuth();
  const [newPost, setNewPost] = useState('');
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // Fetch user profile info
  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: () => userApi.getProfile(user!.id),
    enabled: !!user?.id,
  });

  // Fetch user posts
  const { data: postsData, isLoading: isLoadingPosts, refetch } = useQuery({
    queryKey: ['user-posts', user?.id],
    queryFn: () => userApi.getPosts(user!.id, 0, 20),
    enabled: !!user?.id,
  });

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) return;

    setIsCreatingPost(true);
    try {
      // Create new post using POST /api/v1/post with only description
      const response = await postApi.create(newPost);
      if (response.status === 201 && response.data) {
        // Clear the textarea
        setNewPost('');
        // Refresh posts using GET /api/v1/user/{id}/posts
        await refetch();
      } else {
        throw new Error('Failed to create post');
      }
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('发布失败，请重试');
    } finally {
      setIsCreatingPost(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Please log in to view your profile</h1>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Profile Image */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                  {isLoadingProfile ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
                    </div>
                  ) : userProfile?.data?.profilePhotoSmall ? (
                    <img
                      src={getImageUrl(userProfile.data.profilePhotoSmall)}
                      alt={userProfile.data.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-600">
                      <span className="text-white text-2xl font-bold">
                        {userProfile?.data?.username || user.username}
                      </span>
                    </div>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isLoadingProfile ? '加载中...' : (userProfile?.data?.username || user.username)}
                </h1>
              </div>

              {/* User Stats */}
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">粉丝</span>
                  <span className="font-semibold text-gray-900">
                    {isLoadingProfile ? '...' : (userProfile?.data?.followerCount || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">关注</span>
                  <span className="font-semibold text-gray-900">
                    {isLoadingProfile ? '...' : (userProfile?.data?.followeeCount || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">絮叨</span>
                  <span className="font-semibold text-gray-900">{postsData?.data?.records?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Posts */}
          <div className="lg:col-span-2">
            {/* Create Post */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">发布新内容</h2>
              <div className="space-y-4">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="分享你的想法..."
                  className="w-full h-32 px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPost.trim() || isCreatingPost}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isCreatingPost ? '发布中...' : '发布'}
                  </button>
                </div>
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">我的内容</h2>
              
              {isLoadingPosts ? (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ) : postsData?.data?.records && postsData.data.records.length > 0 ? (
                postsData.data.records.map((post: PostDTO) => (
                  <div key={post.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {(userProfile?.data?.username || user.username).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-gray-900">{userProfile?.data?.username || user.username}</span>
                          <span className="text-gray-500 text-sm">
                            {formatDateTime(post.createTime)}
                          </span>
                        </div>
                        <div className="text-gray-800 whitespace-pre-wrap">
                          {post.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                  <p className="text-gray-500">还没有发布任何内容</p>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
