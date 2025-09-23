import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SolutionDetail from '@/components/pages/SolutionDetail';

interface SolutionDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: SolutionDetailPageProps) {
  return {
    title: `解决方案详情 - Taklip`,
    description: '专业的产品解决方案详情',
  };
}

export default function SolutionDetailPage({ params }: SolutionDetailPageProps) {
  const solutionId = parseInt(params.id);
  
  if (isNaN(solutionId)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Suspense fallback={<SolutionDetailSkeleton />}>
                <SolutionDetail solutionId={solutionId} />
              </Suspense>
            </div>
            
            <div className="lg:col-span-1">
              <Suspense fallback={<SolutionSidebarSkeleton />}>
                <SolutionSidebar solutionId={solutionId} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

function SolutionDetailSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  );
}

function SolutionSidebarSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );
}

// SolutionSidebar component will be created separately
function SolutionSidebar({ solutionId }: { solutionId: number }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">解决方案信息</h3>
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-gray-500">类型</span>
            <p className="text-gray-900">产品解决方案</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">适用行业</span>
            <p className="text-gray-900">通用</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">复杂度</span>
            <p className="text-gray-900">中等</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">联系我们</h3>
        <p className="text-gray-600 mb-4">
          如需了解更多关于此解决方案的信息，请联系我们的专业团队。
        </p>
        <a
          href="/contact"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          立即咨询
        </a>
      </div>
    </div>
  );
}
