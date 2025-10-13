import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ItemDetail from '@/components/pages/ItemDetail';
import { itemApi } from '@/lib/api';

interface ItemDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ItemDetailPageProps): Promise<Metadata> {
  try {
    const response = await itemApi.getById(Number(params.id));
    const item = response.data;

    return {
      title: `${item.name} - 产品详情 - Taklip`,
      description: item.description || `查看 ${item.name} 的详细信息、评分和用户评价`,
      keywords: `${item.name}, 产品, ${item.brand?.name || ''}`,
      openGraph: {
        title: item.name,
        description: item.description || `查看 ${item.name} 的详细信息`,
        images: item.imagePath ? [
          {
            url: `http://www.taklip.com${item.imagePath}`,
            width: 1200,
            height: 630,
            alt: item.name,
          }
        ] : [],
        type: 'article',
        siteName: 'Taklip',
      },
      twitter: {
        card: 'summary_large_image',
        title: item.name,
        description: item.description || `查看 ${item.name} 的详细信息`,
        images: item.imagePath ? [`http://www.taklip.com${item.imagePath}`] : [],
      },
    };
  } catch (error) {
    return {
      title: '产品详情 - Taklip',
      description: '产品详细信息',
    };
  }
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
