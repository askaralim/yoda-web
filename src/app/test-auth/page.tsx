'use client';

import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function TestAuthPage() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Authentication Test Page
            </h1>
            
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Status</h2>
                <p className="text-sm text-gray-600">
                  Authenticated: {isAuthenticated ? 'Yes' : 'No'}
                </p>
              </div>
              
              {user && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900">User Info</h2>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>ID: {user.id}</p>
                    <p>Username: {user.username}</p>
                    <p>Followers: {user.followerCount}</p>
                    <p>Following: {user.followeeCount}</p>
                  </div>
                </div>
              )}
              
              <div className="pt-4">
                <button
                  onClick={() => logout()}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
