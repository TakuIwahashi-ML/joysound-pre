import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ReduxProviders } from '@/providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'カラオケ・うたスキ・歌詞検索｜JOYSOUND.com',
  description:
    'カラオケ配信情報はもちろん、無料で歌詞の検索もできるJOYSOUND公式サイトです。カラオケがもっと楽しくなるコミュニティサービス「うたスキ」、家庭用カラオケサービスやスマホアプリのご紹介など、あなたの音楽ライフに役立つ情報が盛りだくさん♪',
  keywords:
    'カラオケ,歌詞,JOYSOUND,ジョイサウンド,karaoke,ランキング,カラオケ店,最新曲,盛り上がる,採点,うたスキ,ヒトカラ,楽器練習,JOYSOUND f1,ギタナビ,通信カラオケ,歌手',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProviders>{children}</ReduxProviders>
      </body>
    </html>
  );
}
