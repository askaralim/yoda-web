'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getImageUrl } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { userApi } from '@/lib/api';
import { UserDTO } from '@/types';

interface SettingsData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [settingsData, setSettingsData] = useState<SettingsData>({
    username: user?.username || '',
    email: 'taklipdotcom@gmail.com', // This would come from user data
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<SettingsData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettingsData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof SettingsData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      return;
    }

    if (!user || Object.keys(user).length === 0) {
      alert('请先登录');
      return;
    }

    // if (!user.id) {
    //   console.error('User ID missing from user object:', user);
    //   console.log('Available user properties:', Object.keys(user));
    //   // Temporary workaround - use a default user ID for testing
    //   const tempUserId = 1; // This should be replaced with actual user ID
    //   console.log('Using temporary user ID:', tempUserId);
      
    //   // For now, let's try with a hardcoded ID to test the upload
    //   const formData = new FormData();
    //   formData.append('image', selectedImage);
      
    //   console.log('Uploading image for temporary user ID:', tempUserId);
      
    //   // Try without authorization header first to test CORS
    //   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1'}/user/${tempUserId}/settings`, {
    //     method: 'POST',
    //     body: formData,
    //   });

    //   if (response.ok) {
    //     setSuccessMessage('头像更新成功');
    //     setSelectedImage(null);
    //     setPreviewImage(null);
    //   } else {
    //     const errorData = await response.json();
    //     throw new Error(errorData.message || 'Failed to upload image');
    //   }
    //   return;
    // }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      
      // Call the API to upload image (temporarily without auth header due to CORS)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1'}/user/${user.id}/uploadImage`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSuccessMessage('头像更新成功');
        setSelectedImage(null);
        setPreviewImage(null);
        // Refresh user data or update local state
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        alert('网络连接失败，请检查网络连接或稍后重试');
      } else {
        alert('头像上传失败，请重试');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<SettingsData> = {};

    if (!settingsData.username) {
      newErrors.username = 'Username is required';
    } else if (settingsData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!settingsData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(settingsData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (settingsData.password && settingsData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (settingsData.password && settingsData.password !== settingsData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && user) {
      setIsLoading(true);
      setSuccessMessage(null);
      
      try {
        // Here you would call the API to update user settings
        const response = await userApi.update(user.id, settingsData as unknown as UserDTO);
        if (response.status === 200 && response.data) {
          //setUser(response.data);
          setSuccessMessage('设置已保存');
        } else {
          throw new Error('Failed to update settings');
        }
        setSuccessMessage('设置已保存');
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Please log in to access settings</h1>
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
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg">
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-900">设置</h1>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button className="py-4 px-1 border-b-2 border-blue-800 text-blue-900 font-medium">
                  基本
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="p-6">
              {successMessage && (
                <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-green-700">{successMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Avatar Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    头像设置
                  </h3>
                  
                  <div className="flex items-start space-x-8">
                    {/* Avatar Preview */}
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 border-4 border-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : user.profilePhotoSmall ? (
                          <img
                            src={getImageUrl(user.profilePhotoSmall)}
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                            <span className="text-white text-2xl font-bold">
                              {user.username?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Upload overlay */}
                      {selectedImage && (
                        <div className="absolute inset-0 bg-green-500 bg-opacity-80 rounded-2xl flex items-center justify-center">
                          <svg className="w-8 h-8 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex-1 space-y-4">
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={handleImageSelect}
                          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-xl hover:from-blue-800 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                          选择头像
                        </button>
                        
                        {selectedImage && (
                          <button
                            type="button"
                            onClick={handleImageUpload}
                            disabled={isUploading}
                            className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                          >
                            {isUploading ? (
                              <>
                                <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                上传中...
                              </>
                            ) : (
                              <>
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                上传头像
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      
                      {/* File Info */}
                      {selectedImage && (
                        <div className="bg-white rounded-lg p-4 border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                已选择: {selectedImage.name}
                              </p>
                              <p className="text-xs text-gray-600">
                                大小: {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                      用户名
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={settingsData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-gray-900 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                    />
                    {errors.username && (
                      <p className="mt-2 text-sm text-red-600">{errors.username}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      邮箱
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={settingsData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-gray-900 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      密码
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={settingsData.password}
                      onChange={handleChange}
                      placeholder="留空表示不修改密码"
                      className="w-full px-4 py-3 text-gray-900 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                    />
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      确认密码
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={settingsData.confirmPassword}
                      onChange={handleChange}
                      placeholder="确认新密码"
                      className="w-full px-4 py-3 text-gray-900 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? '保存中...' : '保存'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
