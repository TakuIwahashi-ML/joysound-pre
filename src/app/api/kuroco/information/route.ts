// Kuroco CMS Information API
import { fetchKurocoAPI } from '..';

// ページ側で使用する簡潔なInformation型（必要なデータのみ）
export interface Information {
  text: string[];
  links: string[];
}

// Kuroco APIの実際のレスポンス型（大きなJSON）
interface KurocoInformationItem {
  'information-text': string[];
  'information-link': string[];
  // 実際にはもっと多くのフィールドがありますが、
  // 必要な部分のみ型定義
  [key: string]: any; // その他のフィールド
}

interface KurocoInformationResponse {
  list: KurocoInformationItem[];
}

// 🎯 Information一覧取得（必要なデータのみ抽出）
export async function getInformationData(): Promise<{
  data: Information[];
  error?: string;
}> {
  const result = await fetchKurocoAPI<KurocoInformationResponse>('/rcms-api/1/information', {
    list: [],
  });

  if (result.error) {
    return {
      data: [],
      error: result.error,
    };
  }

  // 🎯 必要なデータのみを抽出して整形
  const filteredData: Information[] = result.data.list.map((item) => ({
    text: item['information-text'] || [],
    links: item['information-link'] || [],
  }));

  return {
    data: filteredData,
    error: result.error,
  };
}
