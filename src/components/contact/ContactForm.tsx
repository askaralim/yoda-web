'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { contactApi } from '@/lib/api';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  description: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    description: '',
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const submitContactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await contactApi.submit(data);
      return response.data;
    },
    onSuccess: () => {
      setFormData({ name: '', email: '', subject: '', description: '' });
      setErrors({});
      alert('消息发送成功！我们会尽快回复您。');
    },
    onError: (error) => {
      console.error('Failed to send message:', error);
      alert('发送失败，请稍后重试。');
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入您的姓名';
    }

    if (!formData.email.trim()) {
      newErrors.email = '请输入您的邮箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = '请输入主题';
    }

    if (!formData.description.trim()) {
      newErrors.description = '请输入您的消息';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      submitContactMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">发送消息</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            姓名 *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="请输入您的姓名"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-2">
            邮箱 *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="请输入您的邮箱"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            主题 *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
              errors.subject ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="请输入消息主题"
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            消息 *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="请输入您的消息内容"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitContactMutation.isPending}
          className="w-full px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {submitContactMutation.isPending ? '发送中...' : '发送消息'}
        </button>
      </form>
    </motion.div>
  );
};

export default ContactForm;
