# JOYSOUND プロジェクト

このプロジェクトは、Next.js 13+ App Routerを使用したJOYSOUNDのWebアプリケーションです。自動サイトマップ生成機能を含む、モダンなWebアプリケーションとして構築されています。

## 🚀 開発環境のセットアップ

### 前提条件

- Node.js 18以上
- pnpm（推奨）またはnpm/yarn

### インストール

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて結果を確認してください。

### 環境変数

`.env.local`ファイルを作成して以下の変数を設定してください：

```env
# サイトのベースURL
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# オンデマンドISR用のシークレットトークン（将来のCMS連携用）
REVALIDATION_SECRET_TOKEN=your-secret-token
```

## 📁 プロジェクト構成

```
src/
├── app/                 # Next.js App Router
│   ├── page.tsx        # トップページ
│   ├── sitemap.ts      # Next.js標準のsitemap機能
│   └── api/            # APIルート
├── lib/
│   └── sitemap/        # サイトマップ生成機能
│       ├── index.ts           # メインエクスポート
│       ├── generator.ts       # サイトマップ生成ロジック
│       ├── page-detector.ts   # ページ自動検出ロジック
│       └── kuroco.ts         # Kuroco CMS API クライアント
└── components/         # Reactコンポーネント

scripts/
└── generate-sitemap.ts # CLI生成スクリプト

public/
└── sitemap.xml        # 生成されたサイトマップ
```

## 🗺️ サイトマップ生成機能

このプロジェクトでは、Next.jsのファイルシステムベースのルーティングから実際に存在するページを自動検出してサイトマップを生成する機能を提供しています。

### 主な機能

- **自動ページ検出**: `src/app`ディレクトリから`page.tsx`ファイルを自動検出
- **動的優先度設定**: パスに基づいて適切な優先度と更新頻度を自動設定
- **Next.js標準対応**: Next.js 13+の標準サイトマップ機能を使用
- **手動生成**: CLIスクリプトでサイトマップを手動生成
- **リアルタイム更新**: 新しいページを追加すると自動的にサイトマップに反映

### サイトマップへのアクセス

```
https://your-domain.com/sitemap.xml
```

Next.jsが自動的に適切なContent-Typeヘッダー（`application/xml`）を設定し、SEOに最適化されたサイトマップを提供します。

### 手動でサイトマップを生成

```bash
# サイトマップを生成してpublic/sitemap.xmlに保存
pnpm run generate:sitemap

# ビルド時に自動生成
pnpm run build
```

### 自動検出されるページ

#### 検出対象

- `src/app`ディレクトリ内の`page.tsx`または`page.js`ファイル
- ネストされたディレクトリ内のページも自動検出
- ルートグループ`(group)`内のページも正しく検出

#### 除外対象

- `api`ディレクトリ内のファイル
- 動的ルート`[param]`（実際のデータがないため）
- `layout.tsx`、`loading.tsx`、`error.tsx`などの特殊ファイル

#### 優先度の自動設定

- トップページ (`/`): 1.0
- ランキングページ (`/ranking*`): 0.9
- 検索ページ (`/search*`): 0.8
- アーティスト・楽曲ページ (`/artist*`, `/song*`): 0.7
- ブログページ (`/blog*`): 0.6
- その他のページ: 0.5

#### 更新頻度の自動設定

- トップページ: daily
- ランキングページ: daily/weekly/monthly（パスに応じて）
- 検索・ブログページ: weekly
- アーティスト・楽曲ページ: weekly
- その他のページ: monthly

### プログラムからの使用

```typescript
import { createSitemapGenerator, createPageDetector, kurocoClient } from '@/lib/sitemap';

// サイトマップ生成
const generator = createSitemapGenerator();
const sitemapXml = await generator.generateSitemap();

// ページ検出のみ
const detector = createPageDetector();
const pages = detector.detectPages();
console.log('検出されたページ:', pages);

// Kuroco CMS データ取得
const blogPosts = await kurocoClient.getBlogPosts();
const artists = await kurocoClient.getArtists();
const songs = await kurocoClient.getSongs();
```

### 新しいページの追加

新しいページを追加する場合は、単純に`page.tsx`ファイルを作成するだけで自動的にサイトマップに含まれます：

```bash
# 例：新しい「about」ページを追加
mkdir src/app/about
echo 'export default function About() { return <div>About Page</div>; }' > src/app/about/page.tsx

# サイトマップを再生成
pnpm run generate:sitemap
```

### カスタマイズ

#### 優先度や更新頻度の調整

`src/lib/sitemap/page-detector.ts`の以下のメソッドを編集：

```typescript
// 優先度を調整
private calculatePriority(path: string): number {
  if (path === '/') return 1.0;
  if (path.includes('/ranking')) return 0.9;
  // 新しいルールを追加
  if (path.includes('/special')) return 0.95;
  return 0.5;
}

// 更新頻度を調整
private calculateChangeFreq(path: string): DetectedPage['changefreq'] {
  if (path === '/') return 'daily';
  // 新しいルールを追加
  if (path.includes('/news')) return 'hourly';
  return 'monthly';
}
```

#### 特定のページを除外

`src/lib/sitemap/page-detector.ts`の`scanDirectory`メソッドで除外条件を追加：

```typescript
// 特定のディレクトリを除外
else if (item === 'admin' || item === 'private') {
  continue;
}
```

## 🛠️ 開発・テスト

### ローカルでの確認

```bash
# 開発サーバーを起動
pnpm run dev

# ブラウザで確認
# http://localhost:3000/sitemap.xml
```

### 検出されたページの確認

```bash
# サイトマップを生成（詳細な情報付き）
pnpm run generate:sitemap

# 生成されたファイルを確認
cat public/sitemap.xml
```

### デバッグ

検出されたページの詳細を確認：

```typescript
// src/lib/sitemap/page-detector.ts を一時的に編集
console.log('Detected pages:', pages);
```

## 🚀 デプロイ

### Vercelでのデプロイ

このNext.jsアプリをデプロイする最も簡単な方法は、Next.jsの制作者による[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)を使用することです。

詳細については、[Next.jsデプロイメントドキュメント](https://nextjs.org/docs/app/building-your-application/deploying)をご確認ください。

### 本番環境での注意点

1. 環境変数を適切に設定してください
2. `NEXT_PUBLIC_SITE_URL`を本番ドメインに設定してください
3. サイトマップは自動的に生成されますが、必要に応じて手動で再生成できます

## 📚 技術スタック

- **フレームワーク**: Next.js 13+ (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **パッケージマネージャー**: pnpm
- **CMS**: Kuroco CMS (将来の統合予定)

## 🔮 将来の拡張

### 動的ルートの対応

将来的にCMS連携時は、動的ルートも含めることができます：

```typescript
// 例：ブログ記事の動的ルート
if (path.includes('[slug]') && path.includes('blog')) {
  // CMSからブログ記事一覧を取得して展開
  const blogPosts = await fetchBlogPosts();
  return blogPosts.map((post) => ({
    path: `/blog/${post.slug}`,
    priority: 0.6,
    changefreq: 'weekly',
    isStatic: false,
  }));
}
```

## 📖 Next.jsについて詳しく学ぶ

Next.jsについて詳しく学ぶには、以下のリソースをご確認ください：

- [Next.js Documentation](https://nextjs.org/docs) - Next.jsの機能とAPIについて学ぶ
- [Learn Next.js](https://nextjs.org/learn) - インタラクティブなNext.jsチュートリアル

[Next.js GitHub repository](https://github.com/vercel/next.js)もチェックしてみてください。フィードバックや貢献を歓迎しています！
