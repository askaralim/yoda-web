'use client';

import { motion } from 'framer-motion';
import { ContentDTO } from '@/types';
import { getImageUrl } from '@/lib/utils';
import ContentTableOfContents from './ContentTableOfContents';

interface ContentSidebarProps {
  content: ContentDTO;
}

const ContentSidebar = ({ content }: ContentSidebarProps) => {
  return (
    <div className="space-y-6">
      {/* Content Publisher */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">内容发布</h3>
        <div className="flex items-center gap-3">
          <img
            src={getImageUrl(content.createByUser?.profilePhotoSmall)}
            alt={content.createByUser?.username || 'User'}
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center hidden">
            <span className="text-gray-500 text-sm font-medium">
              {content.createByUser?.username?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {content.createByUser?.username || '未知用户'}
            </p>
            <p className="text-sm text-gray-500">
              {content.createByUser?.followerCount || 0} 关注者
            </p>
          </div>
        </div>
      </motion.div>

      {/* Content Contributor */}
      {content.contributors && content.contributors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">内容贡献</h3>
          <div className="space-y-3">
            {content.contributors.map((contributor, index) => (
              <div key={index} className="flex items-center gap-3">
                <img
                  src={getImageUrl(contributor.user?.profilePhotoSmall)}
                  alt={contributor.user?.username || 'User'}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hidden">
                  <span className="text-gray-500 text-xs font-medium">
                    {contributor.user?.username?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {contributor.user?.username || '未知用户'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {contributor.user?.followerCount || 0} 关注者
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Table of Contents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">本文目录</h3>
        <ContentTableOfContents content={content.description || content.shortDescription || ''} />
      </motion.div>
    </div>
  );
};

export default ContentSidebar;
