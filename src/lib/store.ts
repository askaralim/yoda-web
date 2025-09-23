import { create } from 'zustand';
import { UserDTO, ContentDTO, ItemDTO, BrandDTO } from '@/types';

interface AppState {
  // User state
  user: UserDTO | null;
  isAuthenticated: boolean;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Content state
  featuredContent: ContentDTO[];
  regularContent: ContentDTO[];
  
  // Data state
  topBrands: BrandDTO[];
  topItems: ItemDTO[];
  
  // Actions
  setUser: (user: UserDTO | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFeaturedContent: (content: ContentDTO[]) => void;
  setRegularContent: (content: ContentDTO[]) => void;
  setTopBrands: (brands: BrandDTO[]) => void;
  setTopItems: (items: ItemDTO[]) => void;
  clearError: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  featuredContent: [],
  regularContent: [],
  topBrands: [],
  topItems: [],
  
  // Actions
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user 
  }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  setFeaturedContent: (featuredContent) => set({ featuredContent }),
  
  setRegularContent: (regularContent) => set({ regularContent }),
  
  setTopBrands: (topBrands) => set({ topBrands }),
  
  setTopItems: (topItems) => set({ topItems }),
  
  clearError: () => set({ error: null }),
}));
