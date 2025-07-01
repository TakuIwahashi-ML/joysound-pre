# プロジェクト概要 (Project Overview)

このプロジェクトは、Kuroco CMS をヘッドレス CMS として利用した、Xing が運営するカラオケサービスである Joysound のウェブサイトです。各種ランキンキングやアーティストの楽曲情報を紹介するウェブサイトです。Next.js の App Router を使用し、SSR でレンダリングを基本としながら、オンデマンド ISR を組み合わせてキャッシュの効率的な利用をする為の構成を取っています。

- **主な機能:** 楽曲検索、アーティスト検索、番組検索、アーティスト詳細、楽曲詳細、カラオケランキング（デイリー、週間、月間）、その他特集ページ
- **ターゲットユーザー:** 最新ヒット曲やアニメソング、ボカロ曲などを楽しみたい若年層や、ゲーム感覚でカラオケを楽しみたい人、また、映像コンテンツにこだわるアニメファンやアイドル好きのユーザー

# 技術スタック (Technology Stack)

- **フレームワーク:** Next.js 15.x (App Router)
- **言語:** TypeScript
- **状態管理:** Redux（Redux Toolkit）
- **スタイリング:** Tailwind CSS
- **CMS:** Kuroco
- **テスト:** Jest, React Testing Library
- **バリデーション:** zod
- **データフェッチ（サーバ）:** fetch API（Next.js 標準）
- **データフェッチ（クライアント）:** RTK Query（Redux Toolkit）
- **デプロイ環境:** AWS ECS (Fargate) + CloudFront

# ディレクトリ構造の規約 (Directory Structure Conventions)

- **コンポーネント設計:** UI コンポーネントに関しては、Atomic Design を採用します。

- `app/`: ルーティングとページコンポーネント。サーバーコンポーネントを基本とする。
- `app/api/`： サーバサイドAPI群
- `components/atoms/`: Atomic Design の原子に該当する純粋な UI コンポーネント。
- `components/molecules/`: Atomic Design の分子に該当する純粋な UI コンポーネント。
- `components/organisms/`: Atomic Design の有機体に該当する純粋な UI コンポーネント。
- `components/features/`: 特定の機能に特化した複合コンポーネント。
- `lib/`: 共通のヘルパー関数や、Kuroco の API クライアントなどを配置。
- `hooks/`: 再利用可能なカスタムフックを配置。
- `layouts/`：レイアウトパターンを配置。各ページやディレクトリでこれを読み出して利用する。
- `store/`：reduxで管理するsliceやapiを配置
- `store/services/`：クライアントサイドAPI群

※レイアウト切り替え例（ディレクトリやファイル名は未定）：

```
app/
├── layouts/                     # レイアウトコンポーネント集約
│   ├── PublicLayout.tsx        # 一般ユーザー向け
│   ├── AuthLayout.tsx          # 認証済みユーザー向け
│   ├── AdminLayout.tsx         # 管理者向け
│   ├── CatalogLayout.tsx       # カタログ専用
│   └── README.md               # このファイル
├── (public)/
│   └── layout.tsx              # PublicLayoutを使用
├── (auth)/
│   └── layout.tsx              # AuthLayoutを使用
├── (admin)/
│   └── layout.tsx              # AdminLayoutを使用
├── (catalog)/
│   └── layout.tsx              # CatalogLayoutを使用
└── special-event/
    └── page.tsx                # 個別ページでCatalogLayoutを直接使用
```

※redux storeの管理構造
store/
├── features/
│ ├── sample/ # sample機能slice
│ ├── samle2/ # sample2機能slice
│ └── etc....
└── services/ # クライアントサイドAPI群

# 主要な機能とロジック (Key Features and Logic)

- **データ取得:** 既存のバックエンド API と、Kuroco CMS から API 経由でデータを取得します。クライアントは`lib/kuroco.ts`に実装されています。
- **認証:** 未実装です。（または、〇〇というライブラリで実装）
- **状態管理:** グローバルな状態は Redux（Redux Toolkit）で管理します。ストアは`store/`ディレクトリにあります。

# コーディング規約とスタイルガイド (Coding Conventions)

- **リンター/フォーマッター:** ESLint と Prettier を使用しています。設定はリポジトリのルートにある設定ファイルに従ってください。
- **コンポーネント:** 関数コンポーネントと React Hooks を使用します。クラスコンポーネントは使用しません。
- **命名規則:** コンポーネントはパスカルケース (`MyComponent`)、関数や変数はキャメルケース (`myFunction`) です。

# API 仕様の概要 (API Overview)

- **CMS エンドポイント:**
  ※以下CMSのエンドポイントは仮です。未定なのでのちほど修正します。
  - `blogs`: ブログ記事の一覧・詳細
  - `artists`: アーティスト情報
- **主要なフィールド:**
  - ブログ記事は `title`, `content` (リッチエディタ), `slug`, `eyecatch` (画像) のフィールドを持ちます。

# 環境変数 (Environment Variables)

**注意：実際のキーやパスワードなどの機密情報は絶対に記載しないでください。変数名とその役割だけを記述します。**

- `NEXT_PUBLIC_SITE_URL`: サイトの公開 URL。
- `KUROCO_API_KEY`: Kuroco CMS の API キー。
- `REVALIDATION_SECRET_TOKEN`: オンデマンド ISR の Webhook を検証するためのシークレットトークン。
