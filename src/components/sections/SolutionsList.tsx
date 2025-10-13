'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { solutionApi } from '@/lib/api';
import { getImageUrl, formatDate } from '@/lib/utils';
import { SolutionDTO } from '@/types';

const SolutionsList = () => {
  const [allSolutions, setAllSolutions] = useState<SolutionDTO[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const limit = 20;

  // Initial data fetch
  const { data: initialData, isLoading, error } = useQuery({
    queryKey: ['solutions', 0, limit],
    queryFn: async () => {
      const response = await solutionApi.getAll(0, limit);
      return response.data;
    },
    enabled: true,
    staleTime: 0,
    gcTime: 0,
  });

  // Update allSolutions when initial data loads
  useEffect(() => {
    if (initialData?.records) {
      setAllSolutions(initialData.records);
      setHasMore(initialData.records.length === limit);
      setOffset(limit);
    }
  }, [initialData]);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const response = await solutionApi.getAll(offset, limit);
      const newSolutions = response.data.records;
      
      setAllSolutions(prev => [...prev, ...newSolutions]);
      setHasMore(newSolutions.length === limit);
      setOffset(prev => prev + limit);
    } catch (error) {
      console.error('Failed to load more solutions:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (isLoading) {
    return <SolutionsListSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">加载解决方案失败，请稍后重试</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allSolutions.map((solution, index) => (
          <motion.div
            key={solution.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={`/solutions/${solution.id}`}>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer group h-full">
                <div className="flex flex-col h-full">
                  {/* Solution Image */}
                  <div className="w-full h-48 mb-4 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={getImageUrl(solution.imagePath)}
                      alt={solution.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center hidden">
                      <span className="text-gray-400 text-2xl font-medium">
                        {solution.name?.charAt(0) || 'S'}
                      </span>
                    </div>
                  </div>

                  {/* Solution Content */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold text-gray-400 mb-3 group-hover:text-gray-900 transition-colors duration-200">
                      {solution.title}
                    </h3>

                   <div className="prose max-w-none mb-8">
                      <div className="text-gray-600 mb-4 line-clamp-3 flex-1">
                        {solution.description ? (
                          <div dangerouslySetInnerHTML={{ __html: solution.description }} />
                        ) : (
                          <p>{solution.description || '暂无详细内容'}</p>
                        )}
                      </div>
                    </div>

                    {/* Solution Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{formatDate(solution.createTime)}</span>
                      </div>
                      
                      <span className="text-gray-600 font-medium group-hover:text-gray-800 transition-colors duration-200">
                        查看详情 →
                      </span>
                    </div>
                  </div>
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

      {!hasMore && allSolutions.length > 0 && (
        <div className="text-center mt-12">
          <p className="text-gray-500">已显示所有解决方案</p>
        </div>
      )}
    </div>
  );
};

function SolutionsListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SolutionsList;
