// オンデマンドISR用のAPI Route Handler
// KurocoのWebhookを受け取り、パスを再検証します。

//ローカルで動かす場合は、tunnelを使ってください
// tunnelを使う場合は、以下のコマンドを実行してください
// tunnel http://localhost:3000
// 生成されたURLをkurocoの管理画面のカスタム処理でendpointに設定してください

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  console.log('✅️ === Revalidate API Called ===');
  console.log('✅️ Timestamp:', new Date().toISOString());

  // セキュリティのため、実際には署名検証などを行ってください
  // const signature = request.headers.get('x-kuroco-signature');
  // if (!isValidSignature(signature, ...)) {
  //   return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
  // }

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
