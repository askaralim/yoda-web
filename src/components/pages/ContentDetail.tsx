'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { contentApi } from '@/lib/api';
import { getImageUrl, formatDate } from '@/lib/utils';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ContentTabs from '@/components/content/ContentTabs';
import ContentSidebar from '@/components/content/ContentSidebar';

interface ContentDetailProps {
  contentId: string;
}

const ContentDetail = ({ contentId }: ContentDetailProps) => {
  const [activeTab, setActiveTab] = useState<'need-to-know' | 'related-brands' | 'related-items'>('need-to-know');

  const { data: content, isLoading, error } = useQuery({
    queryKey: ['content-detail', contentId],
    queryFn: async () => {
      const response = await contentApi.getById(parseInt(contentId));
      return response.data;
    },
    enabled: !!contentId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-32 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="lg:col-span-1">
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Content Not Found</h1>
            <p className="text-gray-600">The content you&apos;re looking for doesn&apos;t exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Content Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{content.title}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              {content.category?.name || '未分类'}
            </span>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{formatDate(content.createTime)}</span>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{content.hitCounter || 0}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <ContentTabs
              content={content}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ContentSidebar content={content} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContentDetail;
