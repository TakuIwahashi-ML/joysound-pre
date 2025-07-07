// Kuroco CMS Information API
import { fetchKurocoAPI, normalizeKurocoResponse } from '../index';

// APIレスポンスとページ側で共通使用するInformation型
export interface IInformation {
  'information-text': string[];
  'information-link': string[];
}

interface KurocoInformationResponse {
  list: IInformation[];
}

// 🎯 Information一覧取得（プレビューモード対応）
export async function getInformationData(previewToken?: string): Promise<{
  data: IInformation[];
  error?: string;
  isPreview?: boolean;
}> {
  // プレビュートークンの有無でプレビューモードを判定
  const isPreviewMode = !!previewToken;

  // APIエンドポイントとパラメータの設定
  let apiEndpoint = '/rcms-api/1/information';
  let apiParams: Record<string, string> = {};

  // プレビュートークンがある場合は、下書きデータを取得
  if (isPreviewMode) {
    // プレビュー用の専用エンドポイントを使用
    apiEndpoint = '/rcms-api/1/information/preview';
    apiParams = {
      _doc_lang: 'ja',
    };

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

  const result = await fetchKurocoAPI<KurocoInformationResponse>(
    apiEndpoint,
    { list: [] },
    {
      previewToken: previewToken,
      params: apiParams,
    }
  );

  if (result.error) {
    return {
      data: [],
      error: result.error,
      isPreview: isPreviewMode,
    };
  }

  // 🎯 レスポンス構造を統一
  const normalizedData = normalizeKurocoResponse<IInformation>(result.data, isPreviewMode);

  // 🎯 必要なデータのみを抽出（名前はそのまま維持）
  const filteredData: IInformation[] = normalizedData.list.map((item) => ({
    'information-text': item['information-text'] || [],
    'information-link': item['information-link'] || [],
  }));

  return {
    data: filteredData,
    error: result.error,
    isPreview: isPreviewMode,
  };
}
