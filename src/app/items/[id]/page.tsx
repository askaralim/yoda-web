import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ItemDetail from '@/components/pages/ItemDetail';

interface ItemDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ItemDetailPageProps) {
  return {
    title: `产品详情 - Taklip`,
    description: '产品详细信息',
  };
}

export default function ItemDetailPage({ params }: ItemDetailPageProps) {
  const itemId = parseInt(params.id);
  
  if (isNaN(itemId)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<ItemDetailSkeleton />}>
          <ItemDetail itemId={itemId} />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
}

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
