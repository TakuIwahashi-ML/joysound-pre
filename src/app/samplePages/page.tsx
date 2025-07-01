// import { ConsoleButton } from '@/components/features/sample/ConsoleButton';  // 未使用のため削除
import CommonNavMainLayout from '@/app/layouts/CommonNavMainLayout';

export default function HomePage() {
  return (
    <CommonNavMainLayout>
      {/* トップページのメインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">配下サンプルコンテンツ</div>
    </CommonNavMainLayout>
  );
}
