import { getFunctionData } from '@/app/api/kuroco/function';
import { notFound } from 'next/navigation';

interface FunctionPageProps {
  params: {
    slug?: string[];
  };
  searchParams: {
    preview_token?: string;
  };
}

export default async function FunctionPage({ params, searchParams }: FunctionPageProps) {
  const { slug } = await params;
  const { preview_token } = await searchParams;

  // slugが存在しない場合は404
  if (!slug || slug.length === 0) {
    notFound();
  }

  // URLパラメータからdir_nameとdir_name2を抽出
  const dirName = slug[0];
  const dirName2 = slug[1] || null;

  // Kuroco APIからデータを取得
  const result = await getFunctionData(preview_token);

  if (result.error) {
    console.error('Function data fetch error:', result.error);
    notFound();
  }

  // データが空の場合のデバッグ
  if (result.data.length === 0) {
    console.log('No function data found');
    notFound();
  }

  // URLパラメータでフィルタリング（通常モードとプレビューモードで共通）
  const matchedFunction = result.data.find((item) => {
    const itemDirName = item.dir_name || '';
    const itemDirName2 = item.dir_name2 || '';

    // デバッグ用：各アイテムのマッチング結果をログ出力
    const isMatch =
      dirName2 === null
        ? itemDirName === dirName && (itemDirName2 === '' || itemDirName2 === null)
        : itemDirName === dirName && itemDirName2 === dirName2;

    return isMatch;
  });

  // マッチするデータが見つからない場合は404
  if (!matchedFunction) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Function: {dirName}
        {dirName2 && ` / ${dirName2}`}
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">コンテンツ情報</h2>

        <div className="space-y-4">
          <div>
            <strong>dir_name:</strong> {matchedFunction.dir_name || 'N/A'}
          </div>
          <div>
            <strong>dir_name2:</strong> {matchedFunction.dir_name2 || 'N/A'}
          </div>
          <div>
            <strong>text:</strong> {matchedFunction.text || 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}

// 静的パラメータ生成（ISR用）
export async function generateStaticParams() {
  const result = await getFunctionData();

  if (result.error || !result.data.length) {
    return [];
  }

  const params: Array<{ slug: string[] }> = [];

  result.data.forEach((item) => {
    const dirName = item.dir_name;
    const dirName2 = item.dir_name2;

    if (dirName) {
      if (dirName2 && dirName2 !== '') {
        // dir_name2が存在する場合
        params.push({ slug: [dirName, dirName2] });
      } else {
        // dir_name2が空またはnullの場合
        params.push({ slug: [dirName] });
      }
    }
  });

  return params;
}

// 動的メタデータ生成
export async function generateMetadata({ params, searchParams }: FunctionPageProps) {
  const { slug } = await params;
  const { preview_token } = await searchParams;

  if (!slug || slug.length === 0) {
    return {
      title: 'Function Not Found',
    };
  }

  const dirName = slug[0];
  const dirName2 = slug[1] || null;

  const result = await getFunctionData(preview_token);

  if (result.error || !result.data.length) {
    return {
      title: 'Function Not Found',
    };
  }

  const matchedFunction = result.data.find((item) => {
    const itemDirName = item.dir_name || '';
    const itemDirName2 = item.dir_name2 || '';

    if (dirName2 === null) {
      return itemDirName === dirName && (itemDirName2 === '' || itemDirName2 === null);
    }

    return itemDirName === dirName && itemDirName2 === dirName2;
  });

  if (!matchedFunction) {
    return {
      title: 'Function Not Found',
    };
  }

  const title = dirName2 ? `Function: ${dirName} / ${dirName2}` : `Function: ${dirName}`;

  return {
    title,
    description: matchedFunction.text || `Function page for ${dirName}`,
  };
}

// ISR設定
export const revalidate = 3600; // 1時間ごとに再検証
