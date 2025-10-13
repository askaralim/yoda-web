// API Response Types based on Yoda API Documentation

export interface ContentDTO {
  id: number;
  title: string;
  shortDescription: string;
  description: string;
  pageTitle: string;
  featuredImage: string;
  published: boolean;
  featureData: boolean;
  categoryId: number;
  siteId: number;
  naturalKey: string;
  hitCounter: number;
  homePage: boolean;
  createTime: string;
  updateTime: string;
  publishDate: string;
  expireDate: string;
  createBy: number;
  updateBy: number;
  createByUser: UserDTO;
  updateByUser: UserDTO;
  brands: ContentBrandDTO[];
  contributors: ContentContributorDTO[];
  category: CategoryDTO;
  items: ItemDTO[];
  comments: CommentDTO[];
  score: number;
}

export interface UserDTO {
  id: number;
  username: string;
  email: string;
  profilePhotoSmall: string;
  createTime: string;
  updateTime: string;
  followerCount: number;
  followeeCount: number;
}

export interface BrandDTO {
  id: number;
  company: string;
  country: string;
  description: string;
  foundDate: string;
  hitCounter: number;
  imagePath: string;
  items: ItemDTO[];
  kind: string;
  name: string;
  score: number;
  createTime: string;
  updateTime: string;
}

export interface ItemDTO {
  id: number;
  hitCounter: number;
  price: number;
  rating: number;
  siteId: number;
  brand: BrandDTO;
  category: CategoryDTO;
  contentId: number;
  description: string;
  shortDescription: string;
  imagePath: string;
  level: string;
  name: string;
  buyLinkList: ExtraField[];
  extraFieldList: ExtraField[];
  createTime: string;
  updateTime: string;
  createBy: UserDTO;
  updateBy: UserDTO;
}

export interface CommentDTO {
  id: number;
  contentId: number;
  rating: number;
  siteId: number;
  description: string;
  userId: number;
  createTime: string;
}

export interface CategoryDTO {
  id: number;
  name: string;
  description: string;
}

export interface ContentBrandDTO {
  id: number;
  contentId: number;
  brandId: number;
  brand: BrandDTO;
}

export interface ContentContributorDTO {
  id: number;
  contentId: number;
  userId: number;
  user: UserDTO;
}

export interface ExtraField {
  key: string;
  value: string;
}

export interface SolutionDTO {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  createTime: string;
  updateTime: string;
}

export interface ContactUs {
  id: number;
  name: string;
  email: string;
  message: string;
  createTime: string;
}

export interface PostDTO {
  id: number;
  // title: string;
  description: string;
  createTime: string;
  updateTime: string;
}

export interface TermDTO {
  id: number;
  name: string;
  description: string;
  createTime: string;
  updateTime: string;
}

// API Response Wrapper
export interface PageResponse<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// API Error Response
export interface ApiError {
  error: string;
  timestamp: string;
  path: string;
}

// Authentication Types
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserDTO;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
