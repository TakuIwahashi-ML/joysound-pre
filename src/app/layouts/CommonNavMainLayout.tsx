import React from 'react';

interface CommonNavMainLayoutProps {
  children: React.ReactNode;
}

export default function CommonNavMainLayout({ children }: CommonNavMainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* 共通ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        共通ヘッダー(navmainlayout)
      </header>

      {/* メインコンテンツエリア */}
      <main className="py-8">{children}</main>

      {/* 共通フッター */}
      <footer className="bg-gray-900 text-white py-12">共通フッター(navmainlayout)</footer>
    </div>
  );
}
