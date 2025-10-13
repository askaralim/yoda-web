import axios, { AxiosResponse } from 'axios';
import { 
  ContentDTO, 
  BrandDTO, 
  ItemDTO, 
  UserDTO, 
  SolutionDTO, 
  ContactUs, 
  PostDTO, 
  TermDTO,
  PageResponse,
  ApiError,
  AuthResponse,
  LoginRequest,
  RefreshTokenRequest
} from '@/types';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1';


const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Only add auth header for specific endpoints that require authentication
    const authRequiredEndpoints = [
      '/auth/',
      '/user/',
      '/content/rate',
      '/content/comments',
      '/item/rating',
      '/post'
    ];
    
    // Check if this endpoint requires authentication
    const needsAuth = authRequiredEndpoints.some(endpoint => config.url?.includes(endpoint));
    
    if (needsAuth) {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with JWT refresh logic
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    
    const originalRequest = error.config;
    
    // Only handle 401 errors for authenticated endpoints
    const authRequiredEndpoints = [
      '/auth/',
      '/user/',
      '/content/rate',
      '/content/comments',
      '/item/rating',
      '/post'
    ];
    
    const isAuthEndpoint = authRequiredEndpoints.some(endpoint => originalRequest.url?.includes(endpoint));
    
    // Don't retry refresh token requests to prevent infinite loops
    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }
    
    if (error.response?.status === 401 && !originalRequest._retry && isAuthEndpoint) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
        
        if (refreshToken) {
          const response = await api.post('/auth/refresh', { refreshToken });
          const { accessToken } = response.data;
          
          // Update the token in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', accessToken);
          }
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } else {
          // No refresh token, redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
          }
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
        // Don't retry the original request if refresh failed
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Content API
export const contentApi = {
  getFeatured: (featured: boolean = true, limit: number = 10, offset: number = 0): Promise<AxiosResponse<PageResponse<ContentDTO>>> =>
    api.get('/content/featured', { 
      params: { featured, limit, offset } 
    }),
  
  getById: (id: number): Promise<AxiosResponse<ContentDTO>> =>
    api.get(`/content/${id}`),
  
  getComments: (id: number, offset: number = 0, limit: number = 10): Promise<AxiosResponse<PageResponse<CommentDTO>>> =>
    api.get(`/content/${id}/comments`, { 
      params: { offset, limit } 
    }),
  
  rate: (id: number, thumb: 'up' | 'down'): Promise<AxiosResponse<{ score: number }>> =>
    api.post(`/content/${id}/rate`, null, { 
      params: { thumb } 
    }),
  
  search: (query: string): Promise<AxiosResponse<ContentDTO[]>> =>
    api.get('/content/search', { 
      params: { q: query } 
    }),
  
  submitComment: (id: number, comment: { description: string; rating?: number }): Promise<AxiosResponse<CommentDTO>> =>
    api.post(`/content/${id}/comments`, comment),
};

// Brand API
export const brandApi = {
  getAll: (offset: number = 0, limit: number = 20): Promise<AxiosResponse<PageResponse<BrandDTO>>> =>
    api.get('/brand', { 
      params: { offset, limit } 
    }),
  
  getTopBrands: (): Promise<AxiosResponse<BrandDTO[]>> => {
    return api.get('/brand/topBrands');
  },
  
  getById: (id: number): Promise<AxiosResponse<BrandDTO>> =>
    api.get(`/brand/${id}`),
  
  getItems: (id: number, offset: number = 0, limit: number = 20): Promise<AxiosResponse<PageResponse<ItemDTO>>> =>
    api.get(`/brand/${id}/items`, {
      params: { offset, limit }
    }),
};

// Item API
export const itemApi = {
  getAll: (offset: number = 0, limit: number = 10): Promise<AxiosResponse<PageResponse<ItemDTO>>> =>
    api.get('/item', { 
      params: { offset, limit } 
    }),
  
  getTopItems: (): Promise<AxiosResponse<ItemDTO[]>> => {
    return api.get('/item/topItems');
  },
  
  getById: (id: number): Promise<AxiosResponse<ItemDTO>> =>
    api.get(`/item/${id}`),
  
  rate: (id: number, thumb: 'up' | 'down'): Promise<AxiosResponse<{ rating: number }>> =>
    api.post(`/item/${id}/rating`, null, { 
      params: { thumb } 
    }),
};

// User API
export const userApi = {
  getProfile: (id: number): Promise<AxiosResponse<UserDTO>> =>
    api.get(`/user/${id}/profile`),
  
  getPosts: (id: number, offset: number = 0, limit: number = 10): Promise<AxiosResponse<PageResponse<PostDTO>>> =>
    api.get(`/user/${id}/posts`, { 
      params: { offset, limit } 
    }),
  
  getContents: (id: number, offset: number = 0, limit: number = 10): Promise<AxiosResponse<PageResponse<ContentDTO>>> =>
    api.get(`/user/${id}/contents`, { 
      params: { offset, limit } 
    }),

  update: (id: number, userData: UserDTO): Promise<AxiosResponse<UserDTO>> =>
    api.put(`/user/${id}`, userData),
  
  register: (userData: { username: string; email: string; password: string }): Promise<AxiosResponse<UserDTO>> =>
    api.post('/user/register', userData),
  
  follow: (userId: number, loginUserId: number): Promise<AxiosResponse<void>> =>
    api.post('/user/follow', null, { 
      params: { userId, loginUserId } 
    }),
  
  unfollow: (userId: number, loginUserId: number): Promise<AxiosResponse<void>> =>
    api.post('/user/unfollow', null, { 
      params: { userId, loginUserId } 
    }),
};

// Solution API
export const solutionApi = {
  getAll: (offset: number = 0, limit: number = 3): Promise<AxiosResponse<PageResponse<SolutionDTO>>> =>
    api.get('/solution', { 
      params: { offset, limit } 
    }),
  
  getById: (id: number): Promise<AxiosResponse<SolutionDTO>> =>
    api.get(`/solution/${id}`),
  
  getSolutionItems: (solutionId: number): Promise<AxiosResponse<unknown[]>> =>
    api.get(`/solution/${solutionId}/solutionItems`),
};

// Post API
export const postApi = {
  getAll: (offset: number = 0, limit: number = 10): Promise<AxiosResponse<PageResponse<PostDTO>>> =>
    api.get('/post', { 
      params: { offset, limit } 
    }),
  
  getById: (id: number): Promise<AxiosResponse<PostDTO>> =>
    api.get(`/post/${id}`),
  
  create: (description: string): Promise<AxiosResponse<PostDTO>> =>
    api.post('/post', { description }),
  
  update: (id: number, description: string): Promise<AxiosResponse<PostDTO>> =>
    api.put(`/post/${id}`, { description }),
};

// Term API
export const termApi = {
  getAll: (offset: number = 0, limit: number = 5): Promise<AxiosResponse<PageResponse<TermDTO>>> =>
    api.get('/term', { 
      params: { offset, limit } 
    }),
  
  getById: (id: number): Promise<AxiosResponse<TermDTO>> =>
    api.get(`/term/${id}`),
};

// Contact API
export const contactApi = {
  submit: (contactData: {
    name: string;
    email: string;
    subject: string;
    description: string;
  }): Promise<AxiosResponse<{ success: boolean; description: string }>> =>
    api.post('/contactus', contactData),
};

// Authentication API
export const authApi = {
  login: (credentials: LoginRequest): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/auth/login', credentials),
  
  register: (userData: { username: string; email: string; password: string }): Promise<AxiosResponse<{ message: string }>> =>
    api.post('/auth/register', userData),
  
  refresh: (refreshToken: string): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/auth/refresh', { refreshToken }),
  
  logout: (): Promise<AxiosResponse<{ message: string }>> =>
    api.post('/auth/logout'),
  
  getCurrentUser: (): Promise<AxiosResponse<UserDTO>> =>
    api.get('/auth/me'),
};

export default api;
