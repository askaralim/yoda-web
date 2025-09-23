'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ContentDTO } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { contentApi } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import Link from 'next/link';

interface HomeContentListProps {
  initialContent?: ContentDTO[];
}

const HomeContentList = ({ initialContent = [] }: HomeContentListProps) => {
  const [allContent, setAllContent] = useState<ContentDTO[]>(initialContent);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Initial load query
  const { data, isLoading, error } = useQuery({
    queryKey: ['home-content-list-initial'],
    queryFn: async () => {
      const response = await contentApi.getFeatured(false, 8, 0);
      return response.data;
    },
    initialData: initialContent.length > 0 ? { records: initialContent, total: initialContent.length, size: 8, current: 1, pages: 1 } : undefined,
  });

  // Update allContent when initial data loads
  useEffect(() => {
    if (data?.records) {
      setAllContent(data.records);
      setHasMore(data.current < data.pages);
    }
  }, [data]);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    try {
      const newOffset = offset + 8;
      const response = await contentApi.getFeatured(false, 8, newOffset);
      const newData = response.data;
      
      if (newData.records && newData.records.length > 0) {
        setAllContent(prev => [...prev, ...newData.records]);
        setOffset(newOffset);
        setHasMore(newData.current < newData.pages);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more content:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (isLoading && !initialContent.length) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load home content list</p>
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12"
        >
          精选推荐
        </motion.h2> */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {allContent.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
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
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 hover:text-blue-600 transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3" style={{ color: '#828a92' }}>
                    {item.shortDescription || item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(item.createTime).toLocaleDateString()}
                    </span>
                    <span className="text-sm font-medium text-blue-600">
                      {item.score || 0}
                    </span>
                  </div>
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
              disabled={isLoadingMore}
              className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-700 px-6 py-3 rounded-lg transition-colors duration-200"
            >
              {isLoadingMore ? '加载中...' : '更多'}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default HomeContentList;