'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { brandApi } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

interface BrandItemsProps {
  brandId: number;
}

const BrandItems = ({ brandId }: BrandItemsProps) => {
  const [allItems, setAllItems] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const limit = 20;

  // Initial data fetch
  const { data: initialData, isLoading, error } = useQuery({
    queryKey: ['brand-items', brandId, 0, limit],
    queryFn: async () => {
      const response = await brandApi.getItems(brandId, 0, limit);
      return response.data;
    },
    enabled: !!brandId,
  });

  // Update allItems when initial data loads
  useEffect(() => {
    if (initialData?.records) {
      setAllItems(initialData.records);
      setHasMore(initialData.records.length === limit);
      setOffset(limit);
    }
  }, [initialData]);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const response = await brandApi.getItems(brandId, offset, limit);
      const newItems = response.data.records;
      
      setAllItems(prev => [...prev, ...newItems]);
      setHasMore(newItems.length === limit);
      setOffset(prev => prev + limit);
    } catch (error) {
      console.error('Failed to load more items:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">加载产品失败</p>
      </div>
    );
  }

  if (allItems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">该品牌暂无产品</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <Link href={`/items/${item.id}`}>
              <div className="text-center group cursor-pointer">
                <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center">
                  <img
                    src={getImageUrl(item.imagePath)}
                    alt={item.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center hidden">
                    <span className="text-gray-400 text-xs font-medium">
                      {item.name?.charAt(0) || 'I'}
                    </span>
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 text-sm">
                  {item.name}
                </h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoadingMore ? '加载中...' : '更多'}
          </button>
        </div>
      )}

      {!hasMore && allItems.length > 0 && (
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">已显示所有产品</p>
        </div>
      )}
    </div>
  );
};

export default BrandItems;
