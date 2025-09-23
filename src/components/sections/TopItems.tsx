'use client';

import { motion } from 'framer-motion';
import { ItemDTO } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { itemApi } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import Link from 'next/link';

interface TopItemsProps {
  initialItems?: ItemDTO[];
}

const TopItems = ({ initialItems = [] }: TopItemsProps) => {
  console.log('TopItems component rendered');
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['top-items'],
    queryFn: async () => {
      console.log('Fetching top items...');
      const response = await itemApi.getTopItems();
      console.log('Top items response:', response.data);
      return response.data;
    },
    initialData: initialItems,
    enabled: true, // Explicitly enable the query
  });

  if (isLoading && !initialItems.length) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load top items</p>
      </div>
    );
  }

  const items = data || initialItems;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12"
          style={{ color: '#2c3e50' }}
        >
          最多浏览产品
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <Link href={`/items/${item.id}`}>
                <div className="relative">
                  <img
                    src={getImageUrl(item.imagePath)}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    {item.hitCounter || 0}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 line-clamp-2">
                    {item.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.shortDescription || item.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">
                      {item.brand?.name}
                    </span>
                    <span className="text-sm font-medium text-blue-600">
                      评分: {item.rating || 0}
                    </span>
                  </div>
                  
                  {item.price && (
                    <div className="text-lg font-bold text-green-600">
                      ¥{item.price.toFixed(2)}
                    </div>
                  )}
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
            href="/items"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            查看所有产品
          </Link>
        </motion.div> */}
      </div>
    </section>
  );
};

export default TopItems;
