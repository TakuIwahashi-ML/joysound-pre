import { createPageDetector } from './page-detector';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export class SitemapGenerator {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // 末尾のスラッシュを削除
  }

  // Next.jsで実際に登録されているページを取得
  async getAllUrls(): Promise<SitemapUrl[]> {
    const pageDetector = createPageDetector();
    const detectedUrls = pageDetector.generateSitemapUrls();

    return detectedUrls.map((url) => ({
      loc: url.loc,
      lastmod: url.lastmod,
      changefreq: url.changefreq,
      priority: url.priority,
    }));
  }

  // XMLを生成
  generateXml(urls: SitemapUrl[]): string {
    const urlElements = urls
      .map((url) => {
        let urlElement = `  <url>\n    <loc>${this.escapeXml(url.loc)}</loc>`;

        if (url.lastmod) {
          urlElement += `\n    <lastmod>${url.lastmod}</lastmod>`;
        }

        if (url.changefreq) {
          urlElement += `\n    <changefreq>${url.changefreq}</changefreq>`;
        }

        if (url.priority !== undefined) {
          urlElement += `\n    <priority>${url.priority}</priority>`;
        }

        urlElement += '\n  </url>';
        return urlElement;
      })
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
  }

  // XMLエスケープ
  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // サイトマップを生成して返す
  async generateSitemap(): Promise<string> {
    const urls = await this.getAllUrls();
    return this.generateXml(urls);
  }
}

// デフォルトのサイトマップジェネレーターを作成
export function createSitemapGenerator(): SitemapGenerator {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  return new SitemapGenerator(baseUrl);
}
