'use client';

import { useAuth } from '@/hooks/useAuth';

export default function UserProfile() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        {user.profilePhotoSmall ? (
          <img
            src={user.profilePhotoSmall}
            alt={user.username}
            className="h-8 w-8 rounded-full"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {/* {user.username.charAt(0).toUpperCase()} */}
              {user.username}
            </span>
          </div>
        )}
        {/* <div className="text-sm">
          <p className="font-medium text-gray-900">{user.username}</p>
          <p className="text-gray-500">
            {user.followerCount} followers • {user.followeeCount} following
          </p>
        </div> */}
      </div>
      
      <button
        onClick={() => logout()}
        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        登出
      </button>
    </div>
  );
}
