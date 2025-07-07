import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    // 認証トークンの検証
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.SITEMAP_REVALIDATION_TOKEN;

    if (!expectedToken) {
      return NextResponse.json(
        { error: 'Sitemap revalidation token not configured' },
        { status: 500 }
      );
    }

    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Invalid authorization token' }, { status: 401 });
    }

    // サイトマップの再検証
    revalidatePath('/sitemap.xml');
    revalidatePath('/sitemap');

    // タグベースの再検証（必要に応じて）
    revalidateTag('sitemap');

    return NextResponse.json(
      {
        message: 'Sitemap revalidated successfully',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error revalidating sitemap:', error);

    return NextResponse.json(
      {
        error: 'Failed to revalidate sitemap',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
