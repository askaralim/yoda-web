'use client';

import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4">关于「taklip太离谱」</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              taklip提供的内容是为了帮用户更有效的选择适合自己的产品，
              基本每篇内容都包括以下部分：
            </p>
            <ul className="text-gray-300 leading-relaxed mb-4 list-disc list-inside">
              <li list-style-type="disc">需要知道</li>
              <li list-style-type="disc">相关品牌</li>
              <li list-style-type="disc">推荐产品</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mb-4">功能还在扩充当中，如有任何意见或有兴趣提供相关内容可以使用</p>
            <a 
              href="/contact" 
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              联系我们
            </a>
          </motion.div>

          {/* Social Media Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center md:text-right"
          >
            <h3 className="text-xl font-bold mb-4">社交</h3>
            <div className="flex flex-col items-center md:items-end space-y-4">
              <p className="text-gray-300">taklip太离谱</p>
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-500 text-sm">QR Code</span>
                </div>
                <p className="text-gray-600 text-sm mt-2">taklip太离谱</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-700 mt-8 pt-8 text-center"
        >
          <p className="text-gray-400">
            © 2025 taklip. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
