// オンデマンドISR用のAPI Route Handler
// KurocoのWebhookを受け取り、パスを再検証します。

//ローカルで動かす場合は、tunnelを使ってください
// tunnelを使う場合は、以下のコマンドを実行してください
// tunnel http://localhost:3000
// 生成されたURLをkurocoの管理画面のカスタム処理でendpointに設定してください

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// トークン検証関数
const isValidToken = (token: string | null): boolean => {
  const expectedToken = process.env.KUROCO_API_KEY;

  if (!expectedToken) {
    console.log('✅️ [Security] KUROCO_API_KEY not configured');
    return false;
  }

  if (!token) {
    console.log('✅️ [Security] No token provided');
    return false;
  }

  const isValid = token === expectedToken;
  console.log('✅️ [Security] Token verification:', {
    provided: token.substring(0, 8) + '...',
    match: isValid,
  });

  return isValid;
};

export async function POST(request: NextRequest) {
  console.log('✅️ === Revalidate API Called ===');
  console.log('✅️ Timestamp:', new Date().toISOString());

  // トークン検証（強制的に有効化）
  const token =
    request.headers.get('x-kuroco-token') ||
    request.headers.get('authorization')?.replace('Bearer ', '') ||
    // Kurocoの仕様に合わせて、content-typeヘッダーからトークンを抽出
    request.headers
      .get('content-type')
      ?.match(/x-kuroco-token:\s*([^;]+)/)?.[1]
      ?.trim() ||
    null;

  // 環境変数が設定されていない場合はエラー
  const expectedToken = process.env.KUROCO_API_KEY;
  if (!expectedToken) {
    console.log('✅️ [Security] KUROCO_API_KEY not configured');
    return NextResponse.json({ message: 'Webhook token not configured' }, { status: 500 });
  }

  // トークン検証を実行
  if (!isValidToken(token)) {
    console.log('✅️ [Security] Invalid token');
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  console.log('✅️ [Security] Token verified successfully');

  try {
    const body = await request.json();

    // 二重引用符を除去する関数
    const cleanString = (str: string): string => {
      if (typeof str === 'string' && str.startsWith('"') && str.endsWith('"')) {
        return str.slice(1, -1);
      }
      return str;
    };

    const eventType = cleanString(body?.event_type);
    const contentType = cleanString(body?.content_type);

    console.log(`✅️ [Webhook] 受信: ${eventType} - ${contentType}`);

    // 対象コンテンツタイプのチェック
    const allowedContentTypes = ['information', 'test'];
    if (!allowedContentTypes.includes(contentType)) {
      console.log(`✅️ [Warning] Unknown content type: ${contentType}, but proceeding...`);
    }

    // content_type別のパス設定
    const getPathsForContentType = (
      contentType: string,
      contentId?: string,
      categoryId?: string
    ) => {
      const paths: string[] = [];

      switch (contentType) {
        case 'information':
        case 'test':
          if (contentId) {
            paths.push(`/web/samplePages/${contentId}`);
            if (categoryId) {
              paths.push(`/web/samplePages/?category=${categoryId}`);
            }
          }
          paths.push('/web/samplePages/');
          break;

        default:
          // デフォルトはsample_pagesとして扱う
          if (contentId) {
            paths.push(`/web/samplePages/${contentId}`);
            if (categoryId) {
              paths.push(`/web/samplePages/?category=${categoryId}`);
            }
          }
          paths.push('/web/samplePages/');
          break;
      }

      return paths;
    };

    let pathsToRevalidate: string[] = [];

    switch (eventType) {
      case 'content_created':
      case 'content_updated':
        const content = body?.contents?.new;
        if (content?.id && content.id !== 'unknown') {
          pathsToRevalidate = getPathsForContentType(contentType, content.id, content.category_id);
        } else {
          // IDが不明な場合は一覧ページのみ再検証
          pathsToRevalidate = getPathsForContentType(contentType);
        }
        break;

      case 'content_deleted':
        const deletedContent = body?.contents?.deleted;
        if (deletedContent?.id && deletedContent.id !== 'unknown') {
          pathsToRevalidate = getPathsForContentType(
            contentType,
            deletedContent.id,
            deletedContent.category_id
          );
        } else {
          // IDが不明な場合は一覧ページのみ再検証
          pathsToRevalidate = getPathsForContentType(contentType);
        }
        break;

      default:
        console.log(`✅️ [Error] Unsupported event type: ${eventType}`);
        return NextResponse.json(
          {
            message: `Unsupported event type: ${eventType}`,
          },
          { status: 400 }
        );
    }

    // パスの再検証を実行
    if (pathsToRevalidate.length > 0) {
      console.log(`✅️ [Info] Revalidating paths:`, pathsToRevalidate);

      for (const path of pathsToRevalidate) {
        try {
          revalidatePath(path);
          console.log(`✅️ [Success] Revalidated: ${path}`);
        } catch (error) {
          console.log(`✅️ [Error] Failed to revalidate ${path}:`, error);
        }
      }

      return NextResponse.json({
        revalidated: true,
        paths: pathsToRevalidate,
        event_type: eventType,
        content_type: contentType,
      });
    }

    console.log('✅️ [Warning] No paths to revalidate');
    return NextResponse.json(
      {
        message: 'No paths to revalidate',
      },
      { status: 400 }
    );
  } catch (error) {
    console.log('✅️ [Error] Failed to process webhook:', error);
    return NextResponse.json(
      {
        message: 'Failed to process webhook',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
