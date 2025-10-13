'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import UserDropdown from '@/components/auth/UserDropdown';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const navigationItems = [
    { href: '/', label: '主页' },
    { href: '/brands', label: '品牌' },
    { href: '/terms', label: '词条' },
    { href: '/solutions', label: '解决方案' },
    { href: '/contact', label: '联系我们' },
  ];

  return (
    <header className="bg-slate-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-white hover:text-blue-300 transition-colors">
            taklip
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white hover:text-blue-300 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
            
            {/* Authentication Section */}
            <div className="ml-4 flex items-center space-x-4">
              {isAuthenticated ? (
                <UserDropdown />
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-white hover:text-blue-300 transition-colors duration-200"
                  >
                    登陆
                  </Link>
                  <Link
                    href="/register"
                    className="text-white hover:text-blue-300 transition-colors duration-200"
                  >
                    注册
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white hover:text-blue-300 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4"
          >
            <div className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white hover:text-blue-300 transition-colors duration-200 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Authentication */}
              <div className="pt-4 border-t border-gray-600 space-y-2">
                {isAuthenticated ? (
                  <UserDropdown />
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-white hover:text-blue-300 transition-colors duration-200 py-2 block"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      登陆
                    </Link>
                    <Link
                      href="/register"
                      className="text-white hover:text-blue-300 transition-colors duration-200 py-2 block"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      注册
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </div>
    </header>
  );
};

export default Header;
