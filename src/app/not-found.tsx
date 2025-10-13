import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-gray-200 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            页面未找到
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            抱歉，您访问的页面不存在或已被移除。请检查URL是否正确，或返回首页继续浏览。
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              返回首页
            </Link>
            <Link
              href="/brands"
              className="inline-block bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              浏览品牌
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

