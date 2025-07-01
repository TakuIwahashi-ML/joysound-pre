// Kuroco CMS Information API
import { fetchKurocoAPI } from '..';

// エンドポイント定数
const INFORMATION_ENDPOINT = '/rcms-api/1/information';

// APIレスポンスとページ側で共通使用するInformation型
export interface IInformation {
  'information-text': string[];
  'information-link': string[];
}

interface KurocoInformationResponse {
  list: IInformation[];
}

// 🎯 Information一覧取得（APIレスポンスをそのまま活用）
export async function getInformationData(): Promise<{
  data: IInformation[];
  error?: string;
}> {
  const result = await fetchKurocoAPI<KurocoInformationResponse>(INFORMATION_ENDPOINT, {
    list: [],
  });

  if (result.error) {
    return {
      data: [],
      error: result.error,
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
  };
}
