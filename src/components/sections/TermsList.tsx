'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { termApi } from '@/lib/api';
import { getImageUrl, formatDate } from '@/lib/utils';

const TermsList = () => {
  const [allTerms, setAllTerms] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const limit = 20;

  // Initial data fetch
  const { data: initialData, isLoading, error } = useQuery({
    queryKey: ['terms', 0, limit],
    queryFn: async () => {
      const response = await termApi.getAll(0, limit);
      return response.data;
    },
    enabled: true,
    staleTime: 0,
    gcTime: 0,
  });

  // Statistics query
  const { data: statsData } = useQuery({
    queryKey: ['terms-stats'],
    queryFn: async () => {
      // Mock statistics - in real app, this would come from API
      return {
        totalTerms: 184,
        totalEdits: 526,
        totalReads: 12592,
      };
    },
  });

  // Update allTerms when initial data loads
  useEffect(() => {
    if (initialData?.records) {
      setAllTerms(initialData.records);
      setHasMore(initialData.records.length === limit);
      setOffset(limit);
    }
  }, [initialData]);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const response = await termApi.getAll(offset, limit);
      const newTerms = response.data.records;
      
      setAllTerms(prev => [...prev, ...newTerms]);
      setHasMore(newTerms.length === limit);
      setOffset(prev => prev + limit);
    } catch (error) {
      console.error('Failed to load more terms:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (isLoading) {
    return <TermsListSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">加载词条失败，请稍后重试</p>
      </div>
    );
  }

  return (
    <div>
      {/* Statistics Section */}
      {statsData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-600 mb-2">
              {statsData.totalTerms}
            </div>
            <div className="text-gray-600">词条数量</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-600 mb-2">
              {statsData.totalEdits}
            </div>
            <div className="text-gray-600">编辑次数</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-600 mb-2">
              {statsData.totalReads}
            </div>
            <div className="text-gray-600">阅读量</div>
          </div>
        </motion.div>
      )}

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {allTerms.map((term, index) => (
          <motion.div
            key={term.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={`/terms/${term.id}`}>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer group">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-gray-600 transition-colors duration-200">
                  {term.title}
                </h3>

              <div className="prose max-w-none mb-8">
                <div className="text-gray-500 leading-relaxed">
                {term.shortenDescription ? (
                        <div dangerouslySetInnerHTML={{ __html: term.shortenDescription }} />
                      ) : '暂无词条描述'
                  }
                </div>
              </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{formatDate(term.createTime)}</span>
                  </div>
                  
                  <span className="text-gray-600 text-sm font-medium group-hover:text-gray-800 transition-colors duration-200">
                    更多 &gt;&gt;
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoadingMore ? '加载中...' : '更多'}
          </button>
        </div>
      )}

      {!hasMore && allTerms.length > 0 && (
        <div className="text-center mt-8">
          <p className="text-gray-500">已显示所有词条</p>
        </div>
      )}
    </div>
  );
};

function TermsListSkeleton() {
  return (
    <div>
      {/* Statistics Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-24 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Terms Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* More Button Skeleton */}
      <div className="text-center">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-24 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

export default TermsList;
