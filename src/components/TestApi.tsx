'use client';

import { useEffect } from 'react';
import { brandApi, itemApi } from '@/lib/api';

const TestApi = () => {
  useEffect(() => {
    console.log('TestApi component mounted, testing API calls...');
    
    // Test the API calls directly
    const testApiCalls = async () => {
      try {
        console.log('Testing brand API...');
        const brandResponse = await brandApi.getTopBrands();
        console.log('Brand API success:', brandResponse.data);
      } catch (error) {
        console.error('Brand API error:', error);
      }
      
      try {
        console.log('Testing item API...');
        const itemResponse = await itemApi.getTopItems();
        console.log('Item API success:', itemResponse.data);
      } catch (error) {
        console.error('Item API error:', error);
      }
    };
    
    testApiCalls();
  }, []);

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
      <h3 className="text-lg font-bold">API Test Component</h3>
      <p>Check console for API test results</p>
    </div>
  );
};

export default TestApi;
