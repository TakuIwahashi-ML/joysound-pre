import { headers } from 'next/headers';

/**
 * middlewareで設定されたcanonical URLを取得する
 * @returns canonical URL
 */
export async function getCanonicalUrl(): Promise<string> {
  try {
    const headersList = await headers();
    const canonicalUrl = headersList.get('x-canonical-url');

    if (canonicalUrl) {
      return canonicalUrl;
    }
  } catch (error) {
    // サーバーサイド以外ではheaders()が使えないため、fallback
    console.warn('Failed to get canonical URL from headers:', error);
  }

  // fallback: 環境変数からベースURLを取得
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return baseUrl;
}

/**
 * ページ固有のcanonical URLを生成する
 * @param path ページのパス（例: '/web/samplePages'）
 * @returns 完全なcanonical URL
 */
export function generateCanonicalUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return `${baseUrl}${path}`;
}
