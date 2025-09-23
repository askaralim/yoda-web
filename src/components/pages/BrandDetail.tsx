'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { brandApi } from '@/lib/api';
import { getImageUrl, formatDate } from '@/lib/utils';
import BrandItems from '@/components/brand/BrandItems';

interface BrandDetailProps {
  brandId: number;
}

const BrandDetail = ({ brandId }: BrandDetailProps) => {
  const { data: brand, isLoading, error } = useQuery({
    queryKey: ['brand', brandId],
    queryFn: async () => {
      const response = await brandApi.getById(brandId);
      return response.data;
    },
    enabled: !!brandId,
  });

  if (isLoading) {
    return <BrandDetailSkeleton />;
  }

  if (error || !brand) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">品牌信息加载失败</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Brand Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8"
      >
        <div className="flex items-start gap-6 mb-8">
          <div className="w-24 h-24 flex-shrink-0">
            <img
              src={getImageUrl(brand.imagePath)}
              alt={brand.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center hidden">
              <span className="text-gray-400 text-2xl font-medium">
                {brand.name?.charAt(0) || 'B'}
              </span>
            </div>
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{brand.name}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <span className="text-sm font-medium text-gray-500">成立</span>
                <p className="text-gray-900">{brand.country || '未知'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">产品</span>
                <p className="text-gray-900">{brand.kind || '未知'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Description */}
        {brand.description && (
          <div className="prose max-w-none">
            <div className="text-gray-700 leading-relaxed">
              {brand.description}
            </div>
          </div>
        )}
      </motion.div>

      {/* Brand Items Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">品牌产品</h2>
        <BrandItems brandId={brandId} />
      </motion.div>
    </div>
  );
};

function BrandDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <div className="animate-pulse">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrandDetail;
