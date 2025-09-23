'use client';

import Link from 'next/link';

const AuthPrompt = () => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-3 mb-3">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <h4 className="font-medium text-gray-900">需要登录</h4>
      </div>
      <p className="text-gray-600 mb-4">
        登陆之后再评论吧,不然用户名我不知道该存什么。
      </p>
      <div className="flex gap-3">
        <Link
          href="/login"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          登录
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          注册
        </Link>
      </div>
    </div>
  );
};

export default AuthPrompt;
