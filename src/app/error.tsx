'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', error);
    }
    // TODO: Log to error tracking service (Sentry) in production
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <div className="mb-8">
            <svg
              className="mx-auto h-24 w-24 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            出错了
          </h1>
          <p className="text-gray-600 mb-8">
            应用程序遇到了一个错误。这可能是临时问题，请尝试刷新页面。
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-8 p-4 bg-red-50 rounded-lg text-left">
              <p className="text-sm text-red-800 font-mono">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-600 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => reset()}
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              重试
            </button>
            <Link
              href="/"
              className="inline-block bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

