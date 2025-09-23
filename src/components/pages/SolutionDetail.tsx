'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { solutionApi } from '@/lib/api';
import { getImageUrl, formatDate } from '@/lib/utils';

interface SolutionDetailProps {
  solutionId: number;
}

const SolutionDetail = ({ solutionId }: SolutionDetailProps) => {
  const { data: solution, isLoading, error } = useQuery({
    queryKey: ['solution', solutionId],
    queryFn: async () => {
      const response = await solutionApi.getById(solutionId);
      return response.data;
    },
    enabled: !!solutionId,
  });

  if (isLoading) {
    return <SolutionDetailSkeleton />;
  }

  if (error || !solution) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">解决方案信息加载失败</p>
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
      {/* Solution Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{solution.title}</h1>
        
        <div className="flex items-center gap-2 text-gray-500 mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">{formatDate(solution.createTime)}</span>
        </div>
      </div>

      {/* Solution Image */}
      {solution.imagePath && (
        <div className="w-full h-64 mb-8 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={getImageUrl(solution.imagePath)}
            alt={solution.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="w-full h-full bg-gray-200 flex items-center justify-center hidden">
            <span className="text-gray-400 text-2xl font-medium">
              {solution.title?.charAt(0) || 'S'}
            </span>
          </div>
        </div>
      )}

      {/* Solution Description */}
      <div className="prose max-w-none">
        <div className="text-gray-700 leading-relaxed">
          {solution.description ? (
            <div dangerouslySetInnerHTML={{ __html: solution.description }} />
          ) : (
            <p>暂无详细描述</p>
          )}
        </div>
      </div>

      {/* Solution Features */}
      {/* {solution.features && solution.features.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">主要特性</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {solution.features.map((feature: string, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Solution Benefits */}
      {/* {solution.benefits && solution.benefits.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">解决方案优势</h3>
          <div className="space-y-3">
            {solution.benefits.map((benefit: string, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Call to Action */}
      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">需要此解决方案？</h3>
        <p className="text-gray-600 mb-4">
          联系我们的专业团队，获取更多关于此解决方案的详细信息。
        </p>
        <a
          href="/contact"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          立即咨询
        </a>
      </div>
    </motion.div>
  );
};

function SolutionDetailSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );
}

export default SolutionDetail;
