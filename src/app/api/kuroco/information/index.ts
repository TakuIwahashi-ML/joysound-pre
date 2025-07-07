// Kuroco CMS Information API
import { fetchKurocoAPI } from '../index';
import { cookies } from 'next/headers';

// APIレスポンスとページ側で共通使用するInformation型
export interface IInformation {
  'information-text': string[];
  'information-link': string[];
}

interface KurocoInformationResponse {
  list: IInformation[];
}

// 🎯 Information一覧取得（プレビューモード対応）
export async function getInformationData(): Promise<{
  data: IInformation[];
  error?: string;
  isPreview?: boolean;
}> {
  // プレビュートークンをCookieから取得
  const cookieStore = await cookies();
  const previewToken = cookieStore.get('previewToken')?.value;

  if (previewToken) {
    console.log('✅️ [Preview] Found preview token, fetching draft data');
  }

  const result = await fetchKurocoAPI<KurocoInformationResponse>(
    '/rcms-api/1/information',
    { list: [] },
    { previewToken }
  );

  if (result.error) {
    return {
      data: [],
      error: result.error,
      isPreview: !!previewToken,
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
    isPreview: !!previewToken,
  };
}
