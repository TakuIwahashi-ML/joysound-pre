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

  // slugからdir_nameとdir_name2を抽出
  const dirName = slug[0];
  const dirName2 = slug[1] || null;

  // Kuroco APIからデータを取得
  const result = await getFunctionData(preview_token);

  // デバッグ用ログ
  console.log('Function API result:', {
    error: result.error,
    dataLength: result.data.length,
    isPreview: result.isPreview,
    requestedDirName: dirName,
    requestedDirName2: dirName2,
  });

  if (result.error) {
    console.error('Function data fetch error:', result.error);
    notFound();
  }

  // データが空の場合のデバッグ
  if (result.data.length === 0) {
    console.log('No function data found');
    notFound();
  }

  // デバッグ用：全データをログ出力
  console.log('Raw API response:', JSON.stringify(result.data, null, 2));
  console.log(
    'All function data:',
    result.data.map((item) => ({
      dir_name: item.dir_name,
      dir_name2: item.dir_name2,
      text: item.text,
    }))
  );

  // プレビューモード時は、プレビューデータを直接使用
  let matchedFunction;

  if (result.isPreview) {
    // プレビューモード時は、プレビューデータを直接使用
    matchedFunction = result.data[0];
    console.log('Preview mode: Using preview data directly:', {
      dir_name: matchedFunction?.dir_name,
      dir_name2: matchedFunction?.dir_name2,
      requestedDirName: dirName,
      requestedDirName2: dirName2,
    });
  } else {
    // 通常モード時は、URLパラメータでフィルタリング
    matchedFunction = result.data.find((item) => {
      const itemDirName = item.dir_name || '';
      const itemDirName2 = item.dir_name2 || '';

      // デバッグ用：各アイテムのマッチング結果をログ出力
      const isMatch =
        dirName2 === null
          ? itemDirName === dirName && (itemDirName2 === '' || itemDirName2 === null)
          : itemDirName === dirName && itemDirName2 === dirName2;

      console.log('Matching check:', {
        itemDirName,
        itemDirName2,
        requestedDirName: dirName,
        requestedDirName2: dirName2,
        isMatch,
      });

      return isMatch;
    });
  }

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

        {result.isPreview && (
          <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 rounded">
            <p className="text-yellow-800">
              <strong>プレビューモード:</strong> このページはプレビュー表示です。
            </p>
            {matchedFunction && (
              <div className="mt-2 text-sm">
                <p>
                  <strong>プレビューデータ:</strong>
                </p>
                <ul className="list-disc list-inside">
                  <li>dir_name: {matchedFunction.dir_name}</li>
                  <li>dir_name2: {matchedFunction.dir_name2 || '空'}</li>
                </ul>
                <p className="mt-1 text-xs">
                  ※
                  プレビューモードでは、固定URL（/web/s/function/preview）でアクセスしても、プレビューデータが表示されます。
                </p>
              </div>
            )}
          </div>
        )}
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
