import { MetadataRoute } from 'next';
import { contentApi, brandApi, solutionApi, termApi } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'http://www.taklip.com';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/brands`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/solutions`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  try {
    // Fetch all dynamic content for SEO
    // Using large page size to get all items (adjust if you have more than 1000)
    const [contentsResponse, brandsResponse, solutionsResponse, termsResponse] = await Promise.all([
      contentApi.getFeatured(true, 100, 0).catch(() => ({ data: { records: [] } })),
      brandApi.getAll(0, 1000).catch(() => ({ data: { records: [] } })),
      solutionApi.getAll(0, 1000).catch(() => ({ data: { records: [] } })),
      termApi.getAll(0, 1000).catch(() => ({ data: { records: [] } })),
    ]);

    const contents = contentsResponse.data.records || [];
    const brands = brandsResponse.data.records || [];
    const solutions = solutionsResponse.data.records || [];
    const terms = termsResponse.data.records || [];

    console.log(`Sitemap: Found ${contents.length} contents, ${brands.length} brands, ${solutions.length} solutions, ${terms.length} terms`);

    // Content detail pages (highest priority - main content)
    const contentPages: MetadataRoute.Sitemap = contents.map((content) => ({
      url: `${baseUrl}/content/${content.id}`,
      lastModified: content.updateTime ? new Date(content.updateTime) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

    // Brand detail pages
    const brandPages: MetadataRoute.Sitemap = brands.map((brand) => ({
      url: `${baseUrl}/brands/${brand.id}`,
      lastModified: brand.updateTime ? new Date(brand.updateTime) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    }));

    // Solution detail pages
    const solutionPages: MetadataRoute.Sitemap = solutions.map((solution) => ({
      url: `${baseUrl}/solutions/${solution.id}`,
      lastModified: solution.updateTime ? new Date(solution.updateTime) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }));

    // Term detail pages
    const termPages: MetadataRoute.Sitemap = terms.map((term) => ({
      url: `${baseUrl}/terms/${term.id}`,
      lastModified: term.updateTime ? new Date(term.updateTime) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    }));

    // Combine all pages
    const allPages = [
      ...staticPages,
      ...contentPages,
      ...brandPages,
      ...solutionPages,
      ...termPages,
    ];

    console.log(`Sitemap: Generated ${allPages.length} total URLs`);

    return allPages;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static pages only if dynamic fetch fails
    console.log('Sitemap: Falling back to static pages only');
    return staticPages;
  }
}
