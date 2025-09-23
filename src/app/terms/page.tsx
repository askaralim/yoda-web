import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TermsList from '@/components/sections/TermsList';

export const metadata = {
  title: '词条 - Taklip',
  description: '专业词汇解释',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">词条</h1>
          <p className="text-lg text-gray-600">
            taklip 词条都是从各原创内容中挑选出来的专业词汇解释
          </p>
        </div>
        
        <Suspense fallback={<TermsListSkeleton />}>
          <TermsList />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
}

function TermsListSkeleton() {
  return (
    <div>
      {/* Statistics Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-24 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Terms Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* More Button Skeleton */}
      <div className="text-center">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-24 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
