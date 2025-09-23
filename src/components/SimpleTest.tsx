'use client';

import { useQuery } from '@tanstack/react-query';

const SimpleTest = () => {
  console.log('SimpleTest component rendered');
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['simple-test'],
    queryFn: async () => {
      console.log('Simple test query function called');
      return { message: 'Hello from React Query!' };
    },
    staleTime: 0,
    gcTime: 0,
  });

  console.log('SimpleTest query state:', { data, isLoading, error });

  return (
    <div className="p-4 bg-blue-100 border border-blue-400 rounded m-4">
      <h3 className="text-lg font-bold">Simple React Query Test</h3>
      <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
      <p>Error: {error ? 'Yes' : 'No'}</p>
      <p>Data: {JSON.stringify(data)}</p>
    </div>
  );
};

export default SimpleTest;
