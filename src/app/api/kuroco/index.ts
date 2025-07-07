// Kuroco CMS API共通基盤

// 🎯 統合版：エラーハンドリング内蔵のKuroco API呼び出し関数（プレビューモード対応）
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

    // プレビュートークンがある場合は、プレビュー用のヘッダーを追加
    const headers: Record<string, string> = {
      'X-RCMS-API-ACCESS-TOKEN': process.env.KUROCO_API_KEY || '',
      'Content-Type': 'application/json',
    };

    if (options.previewToken) {
      headers['X-RCMS-API-PREVIEW-TOKEN'] = options.previewToken;
      console.log('✅️ [Preview] Using preview token for draft data');
    }

    const response = await fetch(apiUrl.toString(), {
      headers,
      // プレビューモードの場合はキャッシュを無効化
      next: options.previewToken
        ? { revalidate: 0 }
        : {
            revalidate: options.revalidate ?? 86400,
          },
    });

    if (!response.ok) {
      console.error('Kuroco API Error:', response.status, response.statusText);
      throw new Error(`Kuroco APIからデータを取得できませんでした (${response.status})`);
    }

    const data = await response.json();
    console.log('✅️Kuroco API Response:', data);
    return { data };
  } catch (error) {
    console.error('Kuroco API Error:', error);
    return {
      data: fallbackValue,
      error: error instanceof Error ? error.message : '内部サーバーエラーが発生しました',
    };
  }
}
