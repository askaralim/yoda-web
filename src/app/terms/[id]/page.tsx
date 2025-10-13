import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TermDetail from '@/components/pages/TermDetail';
import { termApi } from '@/lib/api';

interface TermDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: TermDetailPageProps): Promise<Metadata> {
  try {
    const response = await termApi.getById(Number(params.id));
    const term = response.data;

    return {
      title: `${term.name} - 词条详情 - Taklip`,
      description: term.description || `了解 ${term.name} 的专业解释和相关信息`,
      keywords: `${term.name}, 词条, 专业词汇`,
      openGraph: {
        title: term.name,
        description: term.description || `了解 ${term.name} 的专业解释`,
        type: 'article',
        siteName: 'Taklip',
      },
      twitter: {
        card: 'summary_large_image',
        title: term.name,
        description: term.description || `了解 ${term.name} 的专业解释`,
      },
    };
  } catch (error) {
    return {
      title: '词条详情 - Taklip',
      description: '专业词汇解释详情',
    };
  }
}

export default function TermDetailPage({ params }: TermDetailPageProps) {
  const termId = parseInt(params.id);
  
  if (isNaN(termId)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Suspense fallback={<TermDetailSkeleton />}>
                <TermDetail termId={termId} />
              </Suspense>
            </div>
            
            <div className="lg:col-span-1">
              <Suspense fallback={<TermSidebarSkeleton />}>
                <TermSidebar termId={termId} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

function TermDetailSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );
}

function TermSidebarSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
}

// TermSidebar component will be created separately
function TermSidebar({ termId }: { termId: number }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">内容发布</h3>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-gray-500 text-sm font-medium">M</span>
        </div>
        <div>
          <p className="font-medium text-blue-600">Mualim</p>
          <p className="text-sm text-gray-500">内容发布者</p>
        </div>
      </div>
    </div>
  );
}
