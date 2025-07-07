// app/api/preview/exit/route.ts
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // ドラフトモードを無効にする
  (await draftMode()).disable();

  // 元のページに戻るか、トップページにリダイレクト
  const { searchParams } = new URL(request.url);
  const redirectPath = searchParams.get('path') || '/';
  redirect(redirectPath);
}
