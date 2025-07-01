import { MetadataRoute } from 'next';
import { createSitemapGenerator } from '@/lib/sitemap';

// Next.js 15のsitemap機能を使用
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const sitemapGenerator = createSitemapGenerator();
    const urls = await sitemapGenerator.getAllUrls();

    return urls.map((url) => ({
      url: url.loc,
      lastModified: url.lastmod ? new Date(url.lastmod) : new Date(),
      changeFrequency: url.changefreq || 'weekly',
      priority: url.priority || 0.5,
    }));
  } catch (error) {
    console.error('Error generating sitemap:', error);

    // エラー時は最低限のサイトマップを返す
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];
  }
}

// キャッシュ設定
export const revalidate = 3600; // 1時間
