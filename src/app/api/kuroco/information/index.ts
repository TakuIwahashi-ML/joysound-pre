// Kuroco CMS Information API
import { fetchKurocoAPI } from '../index';

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

  // プレビューエンドポイントの場合、detailsプロパティをlist形式に変換
  if (isPreviewMode && result.data && (result.data as any).details) {
    const detailsItem = (result.data as any).details as any;
    const convertedData = {
      ...result.data,
      list: [detailsItem],
    };
    result.data = convertedData;
  }

  // listが存在しない場合のエラーハンドリング
  if (!result.data || !result.data.list) {
    // プレビューエンドポイントの場合、単一アイテムが返される可能性
    if (isPreviewMode && result.data) {
      const singleItem = result.data as any;
      if (singleItem && typeof singleItem === 'object') {
        const filteredData: IInformation[] = [
          {
            'information-text': singleItem['information-text'] || [],
            'information-link': singleItem['information-link'] || [],
          },
        ];

        return {
          data: filteredData,
          error: undefined,
          isPreview: true,
        };
      }
    }

    return {
      data: [],
      error: 'APIレスポンスの形式が正しくありません',
      isPreview: isPreviewMode,
    };
  }

  // 🎯 必要なデータのみを抽出（名前はそのまま維持）
  const filteredData: IInformation[] = result.data.list.map((item) => ({
    'information-text': item['information-text'] || [],
    'information-link': item['information-link'] || [],
  }));

  return {
    data: filteredData,
    error: result.error,
    isPreview: isPreviewMode,
  };
}
