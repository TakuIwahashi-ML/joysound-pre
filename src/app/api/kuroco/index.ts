// Kuroco CMS API共通基盤

// 🎯 Kuroco API呼び出し関数（プレビューモード対応）
export async function fetchKurocoAPI<T>(
  endpoint: string,
  fallbackValue: T,
  options: {
    params?: Record<string, string>;
    revalidate?: number;
    previewToken?: string;
  } = {}
): Promise<{
  data: T;
  error?: string;
}> {
  try {
    // 環境変数からベースURLを取得
    const baseUrl = process.env.KUROCO_API_BASE_URL;
    if (!baseUrl) {
      throw new Error('KUROCO_API_BASE_URLが設定されていません');
    }

    // APIのURLを構築
    const apiUrl = new URL(endpoint, baseUrl);

    // クエリパラメータを追加
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        apiUrl.searchParams.append(key, value);
      });
    }

    // 基本ヘッダーの設定
    const headers: Record<string, string> = {
      'X-RCMS-API-ACCESS-TOKEN': process.env.KUROCO_API_KEY || '',
      'Content-Type': 'application/json',
    };

    // プレビュートークンがある場合は、プレビュー用のヘッダーを追加
    if (options.previewToken) {
      headers['X-RCMS-API-PREVIEW-TOKEN'] = options.previewToken;
    }

    // リクエストを送信
    const response = await fetch(apiUrl.toString(), {
      headers,
      // プレビューモードの場合はキャッシュを無効化
      next: options.previewToken
        ? { revalidate: 0 }
        : {
            // デフォルトでは24時間キャッシュ
            revalidate: options.revalidate ?? 86400,
          },
    });

    // エラーハンドリング
    if (!response.ok) {
      console.error('Kuroco API Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`Kuroco APIからデータを取得できませんでした (${response.status})`);
    }

    // レスポンスをJSON形式でパース
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Kuroco API Error:', error);
    return {
      data: fallbackValue,
      error: error instanceof Error ? error.message : '内部サーバーエラーが発生しました',
    };
  }
}

// 🎯 Kuroco APIレスポンス構造を統一する共通関数
export function normalizeKurocoResponse<T>(
  data: any,
  isPreviewMode: boolean = false
): { list: T[] } {
  // プレビューエンドポイントの場合、detailsプロパティをlist形式に変換
  if (isPreviewMode && data && data.details) {
    const detailsItem = data.details;
    return {
      ...data,
      list: [detailsItem],
    };
  }

  // 通常のレスポンス構造をそのまま返す
  return data;
}
