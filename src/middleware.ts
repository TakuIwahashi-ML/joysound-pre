import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone(); // 元のURLをコピー

  // 保持したいクエリパラメータを定義（例：ページネーションなど）
  const allowedParams = ['page', 'sort'];

  // クエリパラメータを走査し、不要なものを削除
  url.searchParams.forEach((value, key) => {
    if (
      !allowedParams.includes(key) &&
      (key.startsWith('utm_') || key === 'fbclid' || key === 'gclid')
    ) {
      url.searchParams.delete(key);
    }
  });

  // レスポンスヘッダーを作成
  const requestHeaders = new Headers(request.headers);

  // 正規化したURLをカスタムヘッダー 'x-canonical-url' に設定
  requestHeaders.set('x-canonical-url', url.toString());

  // 次の処理に進むためのレスポンスを生成し、カスタムヘッダーを付与
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}

// middlewareを適用するパスを指定
export const config = {
  matcher: [
    // 静的ファイルやAPIルートなどを除外
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
