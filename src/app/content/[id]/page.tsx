import { Metadata } from 'next';
import ContentDetail from '@/components/pages/ContentDetail';
import { contentApi } from '@/lib/api';

interface ContentDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ContentDetailPageProps): Promise<Metadata> {
  try {
    const response = await contentApi.getById(Number(params.id));
    const content = response.data;

    return {
      title: `${content.title} - Taklip`,
      description: content.description || `查看 ${content.title} 的详细信息、相关品牌和产品推荐`,
      keywords: content.title,
      openGraph: {
        title: content.title,
        description: content.description || `查看 ${content.title} 的详细信息`,
        images: content.featuredImage ? [
          {
            url: `http://www.taklip.com${content.featuredImage}`,
            width: 1200,
            height: 630,
            alt: content.title,
          }
        ] : [],
        type: 'article',
        siteName: 'Taklip',
      },
      twitter: {
        card: 'summary_large_image',
        title: content.title,
        description: content.description || `查看 ${content.title} 的详细信息`,
        images: content.featuredImage ? [`http://www.taklip.com${content.featuredImage}`] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Content - Taklip',
      description: 'Content detail page with related brands and products',
    };
  }
}

export default function ContentDetailPage({ params }: ContentDetailPageProps) {
  return <ContentDetail contentId={params.id} />;
}
