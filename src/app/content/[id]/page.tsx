import { Metadata } from 'next';
import ContentDetail from '@/components/pages/ContentDetail';

interface ContentDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ContentDetailPageProps): Promise<Metadata> {
  return {
    title: `Content Detail - Taklip`,
    description: 'Content detail page with related brands and products',
  };
}

export default function ContentDetailPage({ params }: ContentDetailPageProps) {
  return <ContentDetail contentId={params.id} />;
}
