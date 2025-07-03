import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // canonical URLのヘッダー設定のみ
  const response = NextResponse.next();

  // サイトのベースURLを環境変数から取得（デフォルトは現在のホスト）
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`;
  const canonicalUrl = `${baseUrl}${pathname}${search}`;

  // canonical URLをヘッダーに設定（ページ側で取得可能）
  response.headers.set('x-canonical-url', canonicalUrl);

  // 開発時のみログ出力
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ [Middleware] Path：', pathname);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
