import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BrandDetail from '@/components/pages/BrandDetail';
import { brandApi } from '@/lib/api';

interface BrandDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: BrandDetailPageProps): Promise<Metadata> {
  try {
    const response = await brandApi.getById(Number(params.id));
    const brand = response.data;

    return {
      title: `${brand.name} - 品牌详情 - Taklip`,
      description: brand.description || `探索 ${brand.name} 品牌的产品和详细信息`,
      keywords: `${brand.name}, 品牌, 产品`,
      openGraph: {
        title: brand.name,
        description: brand.description || `探索 ${brand.name} 品牌`,
        images: brand.imagePath ? [
          {
            url: `http://www.taklip.com${brand.imagePath}`,
            width: 1200,
            height: 630,
            alt: brand.name,
          }
        ] : [],
        type: 'website',
        siteName: 'Taklip',
      },
      twitter: {
        card: 'summary_large_image',
        title: brand.name,
        description: brand.description || `探索 ${brand.name} 品牌`,
        images: brand.imagePath ? [`http://www.taklip.com${brand.imagePath}`] : [],
      },
    };
  } catch (error) {
    return {
      title: '品牌详情 - Taklip',
      description: '品牌详细信息',
    };
  }
}

export default function BrandDetailPage({ params }: BrandDetailPageProps) {
  const brandId = parseInt(params.id);
  
  if (isNaN(brandId)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<BrandDetailSkeleton />}>
          <BrandDetail brandId={brandId} />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
}

function BrandDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <div className="animate-pulse">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
