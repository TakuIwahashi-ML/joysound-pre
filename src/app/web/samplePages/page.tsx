import { type IInformation, getInformationData } from '@/app/api/kuroco/information/route';

// メインページコンポーネント（サーバーサイドレンダリング）
export default async function SamplePagesPage() {
  // 🎯 統合版：1つの関数呼び出しでエラーハンドリング完了
  const { data: informationData, error } = await getInformationData();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">📢 Information一覧</h1>

      {/* エラー表示 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>エラー:</strong> {error}
        </div>
      )}

      {/* Information一覧 */}
      {!error && informationData.length > 0 && (
        <div className="space-y-6">
          {informationData.map((info: IInformation, index: number) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              {/* Information Text */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">📝 テキスト情報</h3>
                {info['information-text']?.map((text, textIndex) => (
                  <div key={textIndex} className="mb-2">
                    <p className="text-gray-600 bg-gray-50 p-3 rounded">{text}</p>
                  </div>
                ))}
              </div>

              {/* Information Links */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">🔗 リンク情報</h3>
                {info['information-link']?.map((link, linkIndex) => (
                  <div key={linkIndex} className="mb-2">
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      {link}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* データが見つからない場合 */}
      {!error && informationData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">Informationが見つかりませんでした。</p>
        </div>
      )}
    </div>
  );
}
