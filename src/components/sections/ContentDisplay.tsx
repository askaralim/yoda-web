'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ContentDTO } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { contentApi } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import Link from 'next/link';

interface ContentDisplayProps {
  initialContent?: ContentDTO[];
}

const ContentDisplay = ({ initialContent = [] }: ContentDisplayProps) => {
  const [offset, setOffset] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ['regular-content', offset],
    queryFn: async () => {
      const response = await contentApi.getFeatured(false, 10, offset);
      return response.data;
    },
    initialData: initialContent.length > 0 ? { records: initialContent, total: initialContent.length, size: 10, current: 1, pages: 1 } : undefined,
  });

  const handleLoadMore = () => {
    setOffset(prev => prev + 10);
  };

  if (isLoading && !initialContent.length) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load content</p>
      </div>
    );
  }

  const content = data?.records || initialContent;
  const hasMore = data ? offset + 10 < data.total : false;

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12"
        >
          内容展示
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <Link href={`/content/${item.id}`}>
                <div className="relative">
                  <img
                    src={getImageUrl(item.featuredImage)}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    {item.hitCounter || 0}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {item.shortDescription || item.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">
                      {new Date(item.createTime).toLocaleDateString()}
                    </span>
                    <span className="text-sm font-medium text-blue-600">
                      评分: {item.score || 0}
                    </span>
                  </div>
                  
                  {item.category && (
                    <div className="text-sm text-gray-500">
                      分类: {item.category.name}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <button
              onClick={handleLoadMore}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              加载更多
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link
            href="/content"
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            查看所有内容
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ContentDisplay;