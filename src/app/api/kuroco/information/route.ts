// Kuroco CMS Information API
import { fetchKurocoAPI } from '..';

// エンドポイント定数
const INFORMATION_ENDPOINT = '/rcms-api/1/information';

// APIレスポンスとページ側で共通使用するInformation型
export interface Information {
  'information-text': string[];
  'information-link': string[];
}

interface KurocoInformationResponse {
  list: Information[];
}

// 🎯 Information一覧取得（APIレスポンスをそのまま活用）
export async function getInformationData(): Promise<{
  data: Information[];
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
  const filteredData: Information[] = result.data.list.map((item) => ({
    'information-text': item['information-text'] || [],
    'information-link': item['information-link'] || [],
  }));

  return {
    data: filteredData,
    error: result.error,
  };
}
