import React from 'react';

interface CommonNavMainAsideLayoutProps {
  children: React.ReactNode;
}

export default function CommonNavMainAsideLayout({ children }: CommonNavMainAsideLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* 共通ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        共通ヘッダー(navmainAsidelayout)
      </header>

      {/* メインコンテンツエリア */}
      <main className="py-8">{children}</main>

      {/* 共通フッター */}
      <footer className="bg-gray-900 text-white py-12">共通フッター(navmainAsidelayout)</footer>
    </div>
  );
}
