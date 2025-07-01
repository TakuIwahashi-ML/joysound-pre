import { kurocoClient } from '@/lib/sitemap';

export default async function TestApiPage() {
  let blogData = null;
  let artistData = null;
  let error = null;

  try {
    // ブログ記事を取得
    const blogs = await kurocoClient.getBlogPosts({ pageSize: 5 });
    blogData = blogs;

    // アーティストを取得
    const artists = await kurocoClient.getArtists({ pageSize: 5 });
    artistData = artists;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error';
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Kuroco API接続テスト</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>エラー:</strong> {error}
        </div>
      )}

      {blogData && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">ブログ記事</h2>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            ✅ 接続成功！{blogData.list.length}件のブログ記事を取得
          </div>
          <ul className="list-disc pl-6">
            {blogData.list.map((blog: any) => (
              <li key={blog.topics_id}>
                {blog.subject} (ID: {blog.topics_id})
              </li>
            ))}
          </ul>
        </div>
      )}

      {artistData && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">アーティスト</h2>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            ✅ 接続成功！{artistData.list.length}件のアーティストを取得
          </div>
          <ul className="list-disc pl-6">
            {artistData.list.map((artist: any) => (
              <li key={artist.artist_id}>
                {artist.name} (ID: {artist.artist_id})
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">設定情報:</h3>
        <p>
          <strong>Base URL:</strong> {process.env.KUROCO_API_BASE_URL}
        </p>
        <p>
          <strong>API Key:</strong> {process.env.KUROCO_API_KEY ? '設定済み' : '未設定'}
        </p>
      </div>
    </div>
  );
}
