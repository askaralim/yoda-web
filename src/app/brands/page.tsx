import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BrandsList from '@/components/sections/BrandsList';

export const metadata = {
  title: '品牌 - Taklip',
  description: '探索所有品牌',
};

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">品牌</h1>
          <p className="text-gray-600">探索所有品牌</p>
        </div>
        
        <Suspense fallback={<BrandsListSkeleton />}>
          <BrandsList />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
}

function BrandsListSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {[...Array(20)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
