'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { termApi } from '@/lib/api';
import { getImageUrl, formatDate } from '@/lib/utils';

interface TermDetailProps {
  termId: number;
}

const TermDetail = ({ termId }: TermDetailProps) => {
  const { data: term, isLoading, error } = useQuery({
    queryKey: ['term', termId],
    queryFn: async () => {
      const response = await termApi.getById(termId);
      return response.data;
    },
    enabled: !!termId,
  });

  if (isLoading) {
    return <TermDetailSkeleton />;
  }

  if (error || !term) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">词条信息加载失败</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
    >
      {/* Term Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{term.title}</h1>
      
      {/* Timestamp */}
      <div className="flex items-center gap-2 text-gray-500 mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm">{formatDate(term.createTime)}</span>
      </div>

      {/* Term Content */}
      <div className="prose max-w-none">
        <div className="text-gray-700 leading-relaxed">
          {term.description ? (
            <div dangerouslySetInnerHTML={{ __html: term.description }} />
          ) : (
            <p>{term.description || '暂无详细内容'}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

function TermDetailSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );
}

export default TermDetail;
