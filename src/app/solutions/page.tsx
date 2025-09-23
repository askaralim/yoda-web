import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SolutionsList from '@/components/sections/SolutionsList';

export const metadata = {
  title: '解决方案 - Taklip',
  description: '专业的产品解决方案',
};

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">解决方案</h1>
          <p className="text-lg text-gray-600">
            为您的业务提供专业的产品解决方案
          </p>
        </div>
        
        <Suspense fallback={<SolutionsListSkeleton />}>
          <SolutionsList />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
}

function SolutionsListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
