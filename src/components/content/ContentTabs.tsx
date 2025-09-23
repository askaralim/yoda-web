'use client';

import { motion } from 'framer-motion';
import { ContentDTO } from '@/types';
import { getImageUrl } from '@/lib/utils';
import RelatedBrands from './RelatedBrands';
import RelatedItems from './RelatedItems';
import ContentComments from './ContentComments';

interface ContentTabsProps {
  content: ContentDTO;
  activeTab: 'need-to-know' | 'related-brands' | 'related-items';
  onTabChange: (tab: 'need-to-know' | 'related-brands' | 'related-items') => void;
}

const ContentTabs = ({ content, activeTab, onTabChange }: ContentTabsProps) => {
  const tabs = [
    { id: 'need-to-know', label: '需要知道' },
    { id: 'related-brands', label: '相关品牌' },
    { id: 'related-items', label: '推荐产品' },
  ] as const;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'need-to-know' && (
            <div>
              <div className="prose max-w-none mb-8">
                <div className="text-gray-700 leading-relaxed">
                  {content.description ? (
                    <div dangerouslySetInnerHTML={{ __html: content.description }} />
                  ) : (
                    <p>{content.shortDescription || '暂无详细内容'}</p>
                  )}
                </div>
              </div>
              
              {/* Comments Section */}
              <ContentComments contentId={content.id} />
            </div>
          )}

          {activeTab === 'related-brands' && (
            <RelatedBrands brands={content.brands || []} />
          )}

          {activeTab === 'related-items' && (
            <RelatedItems items={content.items || []} />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ContentTabs;
