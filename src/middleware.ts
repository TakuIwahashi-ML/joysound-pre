import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone(); // 元のURLをコピー
  const pathname = request.nextUrl.pathname;

  // ページごとに異なるクエリパラメータ処理を定義
  const canonicalUrl = getCanonicalUrl(url, pathname);

  // レスポンスヘッダーを作成
  const requestHeaders = new Headers(request.headers);

  // 正規化したURLをカスタムヘッダー 'x-canonical-url' に設定
  requestHeaders.set('x-canonical-url', canonicalUrl);

  // 次の処理に進むためのレスポンスを生成し、カスタムヘッダーを付与
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // デバッグログ（.well-known以外のリクエストのみ）
  if (!pathname.startsWith('/.well-known/')) {
    console.log('✅️ [Middleware] 実行:', pathname);
    console.log('✅️ [Middleware] ページURL:', url.toString());
    console.log('✅️ [Middleware] canonical URL:', canonicalUrl);
  }
  return response;
}

// ページごとのcanonical URL生成ロジック
function getCanonicalUrl(url: URL, pathname: string): string {
  const canonicalUrl = new URL(url.toString());

  // ページごとに異なるクエリパラメータ処理
  if (pathname.startsWith('/web/samplePages/')) {
    // （例）サンプルページ: testとtest2のパラメータのみcanonical URLに含めて設定
    const searchParams = new URLSearchParams();
    const allowedSearchParams = ['test', 'test2'];

    canonicalUrl.searchParams.forEach((value: string, key: string) => {
      if (allowedSearchParams.includes(key)) {
        searchParams.set(key, value);
      }
    });
    canonicalUrl.search = searchParams.toString();
  } else if (pathname.startsWith('/web/')) {
    // （例）トップページ： すべてのクエリパラメータを削除してcanonical URLに設定
    canonicalUrl.search = '';
  } else {
    // （例）デフォルト: 一般的なクエリパラメータ処理
    const allowedParams = ['page', 'sort'];

    canonicalUrl.searchParams.forEach((value: string, key: string) => {
      if (
        !allowedParams.includes(key) &&
        (key.startsWith('utm_') || key === 'fbclid' || key === 'gclid')
      ) {
        canonicalUrl.searchParams.delete(key);
      }
    });
  }
  return canonicalUrl.toString();
}

// middlewareを適用するパスを指定
export const config = {
  matcher: [
    // 静的ファイルやAPIルートなどを除外
    '/((?!api|_next/static|_next/image|favicon.ico|.well-known).*)',
  ],
};
