'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { itemApi } from '@/lib/api';
import { getImageUrl, formatDate } from '@/lib/utils';

interface ItemDetailProps {
  itemId: number;
}

const ItemDetail = ({ itemId }: ItemDetailProps) => {
  const router = useRouter();
  
  const { data: item, isLoading, error } = useQuery({
    queryKey: ['item', itemId],
    queryFn: async () => {
      const response = await itemApi.getById(itemId);
      return response.data;
    },
    enabled: !!itemId,
  });

  if (isLoading) {
    return <ItemDetailSkeleton />;
  }

  if (error || !item) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">产品信息加载失败</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          返回
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
      >
        {/* Header with title and view count */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{item.name}</h1>
          <div className="flex items-center gap-2 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-sm">{item.hitCounter || 0}</span>
          </div>
        </div>

        {/* Product Image and Specifications */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* Product Image */}
          <div className="w-full lg:w-1/2">
            <div className="w-full h-96 bg-gray-50 rounded-lg flex items-center justify-center">
              <img
                src={getImageUrl(item.imagePath)}
                alt={item.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center hidden">
                <span className="text-gray-400 text-2xl font-medium">
                  {item.name?.charAt(0) || 'I'}
                </span>
              </div>
            </div>
          </div>

          {/* Product Specifications */}
          <div className="w-full lg:w-1/2">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500 w-20">品牌</span>
                <Link 
                  href={`/brands/${item.brandId}`}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  {item.brandName || '未知品牌'}
                </Link>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500 w-20">参考价</span>
                <span className="text-gray-900">
                  {item.price ? `¥${item.price}` : '面议'}
                </span>
              </div>
              
              {item.specification && (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 w-20">规格</span>
                  <span className="text-gray-900">{item.specification}</span>
                </div>
              )}
              
              {item.type && (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 w-20">类型</span>
                  <span className="text-gray-900">{item.type}</span>
                </div>
              )}
              
              {item.shaftStiffness && (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 w-20">拍杆韧度</span>
                  <span className="text-gray-900">{item.shaftStiffness}</span>
                </div>
              )}
              
              {item.weight && (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 w-20">重量</span>
                  <span className="text-gray-900">{item.weight}</span>
                </div>
              )}
              
              {item.material && (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 w-20">材质</span>
                  <span className="text-gray-900">{item.material}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Description */}
        {item.description && (
          <div className="prose max-w-none mb-8">
            <div className="text-gray-700 leading-relaxed">
              {item.description}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="flex justify-end">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            返回
          </button>
        </div>
      </motion.div>
    </div>
  );
};

function ItemDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-48 h-48 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-3 mb-6">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
