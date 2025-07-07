import { draftMode } from 'next/headers';

// プレビューパラメータの型定義
export interface IPreviewParams {
  preview_token?: string;
  validUntil?: string;
}

/**
 * プレビューモードの初期化処理
 * @param searchParams - URLの検索パラメータ
 * @returns プレビュートークン
 */
export async function initializePreviewMode(searchParams: Promise<IPreviewParams>) {
  const params = await searchParams;
  const previewToken = params.preview_token;

  // プレビュートークンがある場合はプレビューモードを有効化
  if (previewToken) {
    // ドラフトモードを有効化
    (await draftMode()).enable();
  }

  return previewToken;
}
