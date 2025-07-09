// Kuroco CMS Function API
// endpoint: /rcms-api/1/function

import { fetchKurocoAPI, normalizeKurocoResponse } from '../index';

// APIレスポンスとページ側で共通使用するFunction型のインターフェース
export interface IFunction {
  dir_name: string;
  dir_name2: string;
  text: string;
}

interface KurocoFunctionResponse {
  list: IFunction[];
}

// 🎯 Function一覧取得（プレビューモード対応）
export async function getFunctionData(previewToken?: string): Promise<{
  data: IFunction[];
  error?: string;
  isPreview?: boolean;
}> {
  // プレビュートークンの有無でプレビューモードを判定
  const isPreviewMode = !!previewToken;

  // APIエンドポイントとパラメータの設定
  let apiEndpoint = '/rcms-api/1/function';
  let apiParams: Record<string, string> = {};

  // プレビュートークンがある場合は、下書きデータを取得
  if (isPreviewMode) {
    // プレビュー用の専用エンドポイントを使用
    apiEndpoint = '/rcms-api/1/function/preview';

    // プレビュートークンからdraftIdを抽出
    if (previewToken.includes('_')) {
      const parts = previewToken.split('_');
      if (parts.length > 1) {
        const possibleDraftId = parts[1];
        apiParams.draft_id = possibleDraftId;
      }
    }

    // プレビュートークンもクエリパラメータで送信
    apiParams.preview_token = previewToken;
  }

  // Kuroco API呼び出し（共通関数を使用）
  const result = await fetchKurocoAPI<KurocoFunctionResponse>(
    apiEndpoint,
    { list: [] },
    {
      previewToken: previewToken,
      params: apiParams,
    }
  );

  // 🎯 エラーハンドリング
  if (result.error) {
    return {
      data: [],
      error: result.error,
      isPreview: isPreviewMode,
    };
  }

  // 🎯 レスポンス構造を統一
  const normalizedData = normalizeKurocoResponse<IFunction>(result.data, isPreviewMode);

  // 🎯 必要なデータのみを抽出（名前はそのまま維持）
  const filteredData: IFunction[] = normalizedData.list.map((item) => ({
    dir_name: item.dir_name || '',
    dir_name2: item.dir_name2 || '',
    text: item.text || '',
  }));

  return {
    data: filteredData,
    error: result.error,
    isPreview: isPreviewMode,
  };
}
