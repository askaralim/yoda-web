'use client';

import { motion } from 'framer-motion';
import { BrandDTO } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { brandApi } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import Link from 'next/link';

interface TopBrandsProps {
  initialBrands?: BrandDTO[];
}

const TopBrands = ({ initialBrands = [] }: TopBrandsProps) => {
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['top-brands'],
    queryFn: async () => {
      const response = await brandApi.getTopBrands();
      return response.data;
    },
    initialData: initialBrands,
    enabled: true, // Explicitly enable the query
    staleTime: 0, // Force refetch
    gcTime: 0, // Don't cache
  });

  if (isLoading && !initialBrands.length) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-32"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load top brands</p>
      </div>
    );
  }

  const brands = data || initialBrands;

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12"
          style={{ color: '#2c3e50' }}
        >
          最多浏览品牌
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-all duration-300"
            >
              <Link href={`/brands/${brand.id}`}>
                <div className="mb-4">
                  <img
                    src={getImageUrl(brand.imagePath)}
                    alt={brand.name}
                    className="w-24 h-24 mx-auto object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center hidden">
                    <span className="text-gray-500 text-sm font-medium">
                      {brand.name.charAt(0)}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">
                  {brand.name}
                </h3>
                
                <p className="text-sm text-gray-600 mb-2">
                  {brand.company}
                </p>
                
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <span>浏览: {brand.hitCounter || 0}</span>
                  <span>•</span>
                  <span>评分: {brand.score || 0}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link
            href="/brands"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            查看所有品牌
          </Link>
        </motion.div> */}
      </div>
    </section>
  );
};

export default TopBrands;