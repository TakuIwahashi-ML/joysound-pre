import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // URLパラメータから必要な情報を取得
  const secret = searchParams.get('secret');
  const id = searchParams.get('id'); // Kurocoの {id} に対応
  const previewToken = searchParams.get('previewToken'); // Kurocoの {preview_token} に対応
  const endpoint = searchParams.get('endpoint'); // 'blogs'など、どのAPIか
  const path = searchParams.get('path'); // カスタムパス（オプション）

  // 不正なリクエストを防ぐためのシークレットキーを検証 (非常に重要！)
  if (secret !== process.env.KUROCO_PREVIEW_SECRET) {
    return new NextResponse('Invalid token', { status: 401 });
  }

  if (!id || !previewToken || !endpoint) {
    return new NextResponse('Missing required parameters', { status: 400 });
  }

  try {
    // Next.jsのドラフトモードを有効にするCookieをセット
    (await draftMode()).enable();

    // Cookieにプレビュートークンを保存して、ページ側で使えるようにする
    const cookieStore = await cookies();
    cookieStore.set('previewToken', previewToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24時間
    });

    // プレビューしたいページのパスにリダイレクト
    let redirectPath: string;

    if (path) {
      // カスタムパスが指定されている場合はそれを使用
      redirectPath = path.replace('{id}', id);
    } else {
      // デフォルトのパス構造を使用
      redirectPath = `/${endpoint}/${id}`;
    }

    redirect(redirectPath);
  } catch (error) {
    console.error('Preview mode activation failed:', error);
    return new NextResponse('Failed to activate preview mode', { status: 500 });
  }
}
