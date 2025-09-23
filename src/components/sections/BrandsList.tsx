'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { brandApi } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

const BrandsList = () => {
  const [allBrands, setAllBrands] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const limit = 20;

  // Initial data fetch
  const { data: initialData, isLoading, error } = useQuery({
    queryKey: ['brands', 0, limit],
    queryFn: async () => {
      const response = await brandApi.getAll(0, limit);
      return response.data;
    },
    enabled: true,
    staleTime: 0,
    gcTime: 0,
  });

  // Update allBrands when initial data loads
  useEffect(() => {
    if (initialData?.records) {
      setAllBrands(initialData.records);
      setHasMore(initialData.records.length === limit);
      setOffset(limit);
    }
  }, [initialData]);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const response = await brandApi.getAll(offset, limit);
      const newBrands = response.data.records;
      
      setAllBrands(prev => [...prev, ...newBrands]);
      setHasMore(newBrands.length === limit);
      setOffset(prev => prev + limit);
    } catch (error) {
      console.error('Failed to load more brands:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">加载品牌失败，请稍后重试</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {allBrands.map((brand, index) => (
          <motion.div
            key={brand.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <Link href={`/brands/${brand.id}`}>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 mb-4 flex items-center justify-center">
                    <img
                      src={getImageUrl(brand.imagePath)}
                      alt={brand.name}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center hidden">
                      <span className="text-gray-400 text-xs font-medium">
                        {brand.name?.charAt(0) || 'B'}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {brand.name}
                  </h3>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-12">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoadingMore ? '加载中...' : '更多'}
          </button>
        </div>
      )}

      {!hasMore && allBrands.length > 0 && (
        <div className="text-center mt-12">
          <p className="text-gray-500">已显示所有品牌</p>
        </div>
      )}
    </div>
  );
};

export default BrandsList;
