import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore, useAuth as useAuthStoreAuth, useAuthActions } from '@/lib/auth-store';
import { authApi } from '@/lib/api';
import { LoginRequest, AuthResponse, UserDTO } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AxiosResponse } from 'axios';

export const useAuth = () => {
  const auth = useAuthStoreAuth() as {
    user: UserDTO | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  };
  const actions = useAuthActions() as {
    login: (authResponse: AuthResponse) => void;
    logout: () => void;
    setUser: (user: UserDTO) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
  };
  const router = useRouter();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (response) => {
      const authResponse: AuthResponse = response.data;
      actions.login(authResponse);
      actions.clearError();
      router.push('/');
    },
    onError: (error: unknown) => {
      actions.setError((error as any)?.response?.data?.error || 'Login failed');
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      actions.logout();
      router.push('/login');
    },
    onError: () => {
      // Even if logout fails on server, clear local state
      actions.logout();
      router.push('/login');
    },
  });

  // Get current user query
  const { data: currentUser, isLoading: isLoadingUser, error: userError } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authApi.getCurrentUser(),
    enabled: auth.isAuthenticated,
    retry: false,
  });

  // Handle successful user fetch
  useEffect(() => {
    if (currentUser?.data) {
      actions.setUser(currentUser.data);
    }
  }, [currentUser, actions]);

  // Handle user fetch error
  useEffect(() => {
    if (currentUser === null && auth.isAuthenticated) {
      actions.logout();
    }
  }, [currentUser, auth.isAuthenticated, actions]);

  // Auto-login on app start if tokens exist
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      
      if (token && refreshToken && !auth.isAuthenticated) {
        // Set tokens in store to enable the useQuery
        actions.login({
          accessToken: token,
          refreshToken: refreshToken,
          tokenType: 'Bearer',
          expiresIn: 3600,
          user: auth.user || {} as UserDTO
        });
      }
    }
  }, [auth.isAuthenticated, auth.user, actions]);

  return {
    ...auth,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading: loginMutation.isPending || logoutMutation.isPending || isLoadingUser,
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
  };
};

// Hook for protected routes
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
};

