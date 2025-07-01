import React from 'react';

interface TopLayoutProps {
  children: React.ReactNode;
}

export default function TopLayout({ children }: TopLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* トップページ専用ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200">トップヘッダー</header>

      {/* メインコンテンツエリア */}
      <main className="py-8">{children}</main>

      <footer className="bg-gray-900 text-white py-12">トップフッター</footer>
    </div>
  );
}
