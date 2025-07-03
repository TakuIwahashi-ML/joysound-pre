import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // URL正規化の処理
  let normalizedPathname = pathname;

  // 1. trailing slashの正規化（末尾のスラッシュを統一）
  // /web を /web/ にリダイレクト
  if (pathname === '/web') {
    const url = request.nextUrl.clone();
    url.pathname = '/web/';
    return NextResponse.redirect(url, 301);
  }

  // 2. 大文字小文字の正規化（必要に応じて）
  // 例: /Web/ を /web/ にリダイレクト
  if (pathname.toLowerCase() !== pathname && pathname.startsWith('/web')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 301);
  }

  // 3. canonical URLのヘッダー設定
  const response = NextResponse.next();

  // サイトのベースURLを環境変数から取得（デフォルトはlocalhost）
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const canonicalUrl = `${baseUrl}${normalizedPathname}${search}`;

  // canonical URLをヘッダーに設定（ページ側で取得可能）
  response.headers.set('x-canonical-url', canonicalUrl);

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
