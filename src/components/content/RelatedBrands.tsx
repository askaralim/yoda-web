'use client';

import { motion } from 'framer-motion';
import { ContentBrandDTO } from '@/types';
import { getImageUrl } from '@/lib/utils';
import Link from 'next/link';

interface RelatedBrandsProps {
  brands: ContentBrandDTO[];
}

const RelatedBrands = ({ brands }: RelatedBrandsProps) => {
  if (brands.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>暂无相关品牌</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {brands.map((brandItem, index) => (
        <motion.div
          key={brandItem.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-300"
        >
          {/* Brand Image */}
          <div className="flex-shrink-0">
            <Link href={`/brands/${brandItem.brand.id}`}>
              <img
                src={getImageUrl(brandItem.brand.imagePath)}
                alt={brandItem.brand.name}
                className="w-16 h-16 object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center hidden">
                <span className="text-gray-500 text-sm font-medium">
                  {brandItem.brand.name.charAt(0)}
                </span>
              </div>
            </Link>
          </div>

          {/* Brand Content */}
          <div className="flex-1">
            <Link href={`/brands/${brandItem.brand.id}`}>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 mb-2">
                {brandItem.brand.name}
              </h3>
            </Link>
            
            <p className="text-gray-600 text-sm mb-2">
              {brandItem.brand.company}
            </p>
            
            <p className="text-gray-700 text-sm leading-relaxed">
              {brandItem.brand.description ? (
                <div dangerouslySetInnerHTML={{ __html: brandItem.brand.description }} />
              ) : '暂无品牌描述'}
            </p>
            
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span>浏览: {brandItem.brand.hitCounter || 0}</span>
              <span>评分: {brandItem.brand.score || 0}</span>
              {brandItem.brand.country && (
                <span>国家: {brandItem.brand.country}</span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default RelatedBrands;
