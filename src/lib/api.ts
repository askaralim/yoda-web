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
  ApiError 
} from '@/types';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1';
console.log('API Base URL:', baseURL);

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
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log('API Response Error:', error.response?.status, error.config?.url, error.message);
    if (error.response?.status === 401) {
      // Handle unauthorized
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
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
  
  getComments: (id: number, offset: number = 0, limit: number = 10): Promise<AxiosResponse<PageResponse<any>>> =>
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
  
  submitComment: (id: number, comment: { description: string; rating?: number }): Promise<AxiosResponse<any>> =>
    api.post(`/content/${id}/comments`, comment),
};

// Brand API
export const brandApi = {
  getAll: (offset: number = 0, limit: number = 20): Promise<AxiosResponse<PageResponse<BrandDTO>>> =>
    api.get('/brand', { 
      params: { offset, limit } 
    }),
  
  getTopBrands: (): Promise<AxiosResponse<BrandDTO[]>> => {
    console.log('API: Calling /brand/topBrands');
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
    console.log('API: Calling /item/topItems');
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
  
  register: (userData: any): Promise<AxiosResponse<UserDTO>> =>
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
  
  getSolutionItems: (solutionId: number): Promise<AxiosResponse<any[]>> =>
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
  
  create: (postData: PostDTO): Promise<AxiosResponse<PostDTO>> =>
    api.post('/post', postData),
  
  update: (id: number, postData: PostDTO): Promise<AxiosResponse<PostDTO>> =>
    api.put(`/post/${id}`, postData),
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

export default api;
