# Yoda Frontend - Product Recommendation Platform

A modern, responsive web application for the Yoda Content Management System, built with Next.js 14+ and TypeScript.

## 🚀 Features

- **Homepage**: Featured content, top brands, and top products
- **Content Management**: Articles and content with ratings
- **Product Catalog**: Items with brands, categories, and detailed information
- **Brand Management**: Brand information and product listings
- **User System**: Profiles, following, and authentication
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Query
- **Animations**: Framer Motion
- **API**: Axios for Spring Boot backend integration

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Homepage
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── layout/           # Layout components
│   └── sections/         # Page sections
├── lib/                  # Utilities and configurations
│   ├── api.ts           # API client
│   ├── store.ts         # Zustand store
│   └── query-client.ts  # React Query client
├── types/               # TypeScript types
└── hooks/               # Custom React hooks
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Access to Yoda Spring Boot backend API

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🔌 API Integration

The frontend integrates with the Yoda Spring Boot backend API:

### Expected Endpoints
- `GET /api/v1/content/featured` - Featured content
- `GET /api/v1/brand/topBrands` - Top brands
- `GET /api/v1/item/topItems` - Top items
- `GET /api/v1/content/featured?featured=false` - Regular content

### API Client Configuration
```typescript
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});
```

## 📱 Pages & Features

### Homepage (`/`)
- Featured content section
- Top brands grid
- Top products grid
- Content display section

### Navigation
- 主页 (Home)
- 品牌 (Brands)
- 词条 (Terms)
- 解决方案 (Solutions)
- 联系我们 (Contact Us)
- 登陆 (Login)

## 🎨 Design System

### Colors
- Primary: Blue color palette
- Secondary: Supporting color palette
- Neutral: Grays for text and backgrounds

### Components
- Reusable UI components in `components/ui/`
- Consistent spacing and sizing
- Mobile-first responsive design

## 📱 Responsive Design

- **Mobile First**: Designed for mobile devices first
- **Breakpoints**: Tailwind CSS responsive breakpoints
- **Touch Friendly**: Optimized for touch interactions
- **Performance**: Optimized images and lazy loading

## 🔍 SEO & Performance

### SEO Features
- Server-side rendering (SSR)
- Meta tags and Open Graph
- Structured data for products
- Sitemap generation

### Performance
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Bundle size optimization
- Core Web Vitals optimization

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy automatically on push

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:8081/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For questions or support, please contact the development team or create an issue in the repository.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**