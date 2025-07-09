// import { ConsoleButton } from '@/components/features/sample/ConsoleButton';  // 未使用のため削除
import TopLayout from '@/app/layouts/TopLayout';
import Link from 'next/link';
import ReactVersionChecker from '@/components/ReactVersionChecker';
import GetSampleDataComponent from '@/components/features/sample/GetSampleDataComponent'; // 一時的に無効化

export default function HomePage() {
  return (
    <TopLayout>
      {/* トップページのメインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">トップメインコンテンツ</div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="mt-10">
          <Link href="/web/samplePages">＞＞ インフォメーションページリンク</Link>
        </p>
        <p className="mt-10">
          <Link href="/web/s/function/bunseki">＞＞ function/bunsekiページリンク</Link>
        </p>
        <p className="mt-10">
          <Link href="/web/s/function/bunseki2">＞＞ function/bunseki2ページリンク</Link>
        </p>
        <p className="mt-10">
          <Link href="/web/s/function/movie/movie">＞＞ function/movie/movieページリンク</Link>
        </p>
        <p className="mt-10">
          <Link href="/web/s/function/movie/movie2">＞＞ function/movie/movie2ページリンク</Link>
        </p>
        <div>
          <GetSampleDataComponent />
        </div>

        {/* React 19バージョンチェッカーを追加 */}
        <div className="mt-8">
          <ReactVersionChecker />
        </div>
      </div>
    </TopLayout>
  );
}
