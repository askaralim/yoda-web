'use client';

import { motion } from 'framer-motion';
import { ItemDTO } from '@/types';
import { getImageUrl } from '@/lib/utils';
import Link from 'next/link';

interface RelatedItemsProps {
  items: ItemDTO[];
}

const RelatedItems = ({ items }: RelatedItemsProps) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>暂无推荐产品</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-300"
        >
          {/* Item Image */}
          <div className="flex-shrink-0">
            <Link href={`/items/${item.id}`}>
              <img
                src={getImageUrl(item.imagePath)}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center hidden">
                <span className="text-gray-500 text-sm font-medium">
                  {item.name.charAt(0)}
                </span>
              </div>
            </Link>
          </div>

          {/* Item Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <Link href={`/items/${item.id}`}>
                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                  {item.name}
                </h3>
              </Link>
              
              {/* Rating Buttons */}
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 text-green-600 hover:text-green-700">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.994a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  <span className="text-sm">{item.rating || 0}</span>
                </button>
                <button className="flex items-center gap-1 text-red-600 hover:text-red-700">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.994a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4L13.2 12.067a4 4 0 00.8-2.4z" />
                  </svg>
                  <span className="text-sm">0</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
              <div>
                <span className="font-medium">品牌:</span> {item.brand?.name || '无品牌'}
              </div>
              <div>
                <span className="font-medium">参考价:</span> ¥{item.price?.toFixed(2) || '0.00'}
              </div>
            </div>
            
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              {item.shortDescription ? (
                <div dangerouslySetInnerHTML={{ __html: item.shortDescription }} />
              ) : item.description ? (
                <div dangerouslySetInnerHTML={{ __html: item.description }} />
              ) : '暂无产品描述'}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>浏览: {item.hitCounter || 0}</span>
              <span>评分: {item.rating || 0}</span>
              {item.level && (
                <span>等级: {item.level}</span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default RelatedItems;
