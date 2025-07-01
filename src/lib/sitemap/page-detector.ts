import { readdirSync, statSync } from 'fs';
import { join } from 'path';

export interface DetectedPage {
  path: string;
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  isStatic: boolean;
}

export class PageDetector {
  private appDir: string;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.appDir = join(process.cwd(), 'src', 'app');
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  // ディレクトリを再帰的に探索してページを検出
  private scanDirectory(dir: string, basePath: string = ''): DetectedPage[] {
    const pages: DetectedPage[] = [];

    try {
      const items = readdirSync(dir);

      for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
          // ルートグループ（括弧で囲まれたディレクトリ）は無視
          if (item.startsWith('(') && item.endsWith(')')) {
            pages.push(...this.scanDirectory(fullPath, basePath));
          }
          // APIディレクトリは無視
          else if (item === 'api') {
            continue;
          }
          // 通常のディレクトリ
          else {
            const newBasePath = basePath ? `${basePath}/${item}` : item;
            pages.push(...this.scanDirectory(fullPath, newBasePath));
          }
        }
        // page.tsx または page.js ファイルを検出
        else if (item === 'page.tsx' || item === 'page.js') {
          const pagePath = basePath || '/';
          const cleanPath = pagePath === '/' ? '/' : `/${basePath}`;

          pages.push({
            path: cleanPath,
            priority: this.calculatePriority(cleanPath),
            changefreq: this.calculateChangeFreq(cleanPath),
            isStatic: true,
          });
        }
      }
    } catch (error) {
      console.warn(`ディレクトリの読み取りに失敗しました: ${dir}`, error);
    }

    return pages;
  }

  // パスに基づいて優先度を計算
  private calculatePriority(path: string): number {
    if (path === '/') return 1.0;
    if (path.includes('/ranking')) return 0.9;
    if (path.includes('/search')) return 0.8;
    if (path.includes('/artist') || path.includes('/song')) return 0.7;
    if (path.includes('/blog')) return 0.6;
    return 0.5;
  }

  // パスに基づいて更新頻度を計算
  private calculateChangeFreq(path: string): DetectedPage['changefreq'] {
    if (path === '/') return 'daily';
    if (path.includes('/ranking')) {
      if (path.includes('/daily')) return 'daily';
      if (path.includes('/weekly')) return 'weekly';
      if (path.includes('/monthly')) return 'monthly';
      return 'daily';
    }
    if (path.includes('/search')) return 'weekly';
    if (path.includes('/blog')) return 'weekly';
    if (path.includes('/artist') || path.includes('/song')) return 'weekly';
    return 'monthly';
  }

  // 動的ルートのパラメータを検出
  private isDynamicRoute(path: string): boolean {
    return path.includes('[') && path.includes(']');
  }

  // すべてのページを検出
  detectPages(): DetectedPage[] {
    const pages = this.scanDirectory(this.appDir);

    // 動的ルートを除外（実際のデータがないため）
    const staticPages = pages.filter((page) => !this.isDynamicRoute(page.path));

    // 重複を除去
    const uniquePages = staticPages.filter(
      (page, index, self) => index === self.findIndex((p) => p.path === page.path)
    );

    // パスでソート
    return uniquePages.sort((a, b) => {
      if (a.path === '/') return -1;
      if (b.path === '/') return 1;
      return a.path.localeCompare(b.path);
    });
  }

  // サイトマップ用のURLを生成
  generateSitemapUrls(): Array<{
    loc: string;
    lastmod: string;
    changefreq: DetectedPage['changefreq'];
    priority: number;
  }> {
    const pages = this.detectPages();
    const now = new Date().toISOString();

    return pages.map((page) => ({
      loc: `${this.baseUrl}${page.path}`,
      lastmod: now,
      changefreq: page.changefreq,
      priority: page.priority,
    }));
  }
}

// デフォルトのページ検出器を作成
export function createPageDetector(): PageDetector {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000';
  return new PageDetector(baseUrl);
}
