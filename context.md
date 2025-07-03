# プロジェクト概要 (Project Overview)

このプロジェクトは、Kuroco CMS をヘッドレス CMS として利用した、Xing が運営するカラオケサービスである Joysound のウェブサイトです。各種ランキンキングやアーティストの楽曲情報を紹介するウェブサイトです。Next.js の App Router を使用し、SSR でレンダリングを基本としながら、オンデマンド ISR を組み合わせてキャッシュの効率的な利用をする為の構成を取っています。

- **主な機能:** 楽曲検索、アーティスト検索、番組検索、アーティスト詳細、楽曲詳細、カラオケランキング（デイリー、週間、月間）、その他特集ページ
- **ターゲットユーザー:** 最新ヒット曲やアニメソング、ボカロ曲などを楽しみたい若年層や、ゲーム感覚でカラオケを楽しみたい人、また、映像コンテンツにこだわるアニメファンやアイドル好きのユーザー

# 技術スタック (Technology Stack)

- **パッケージ管理:** pnpm
- **フレームワーク:** Next.js 15.x (App Router)
- **言語:** TypeScript
- **状態管理:** Redux（Redux Toolkit）
- **スタイリング:** Tailwind CSS v4（※設定ファイル不要、PostCSS統合による自動設定）
- **CMS:** Kuroco
- **テスト:** Jest, React Testing Library
- **バリデーション:** zod
- **データフェッチ（サーバ）:** fetch API（Next.js 標準）
- **データフェッチ（クライアント）:** RTK Query（Redux Toolkit）
- **デプロイ環境:** AWS ECS (Fargate) + CloudFront

# ディレクトリ構造の規約 (Directory Structure Conventions)

## 基本方針

- **コンポーネント設計:** UI コンポーネントに関しては、Atomic Design を採用します。
- **ファイル命名:** PascalCase（コンポーネント）、camelCase（関数・変数）を使用

- `app/`: ルーティングとページコンポーネント。サーバーコンポーネントを基本とする。
- `app/api/`： サーバサイドAPI群（next.js 標準fetch）
- `app/layouts/`：レイアウトパターンを配置。各ページやディレクトリでこれを読み出して利用する。
- `components/atoms/`: Atomic Design の原子に該当する純粋な UI コンポーネント。
- `components/molecules/`: Atomic Design の分子に該当する純粋な UI コンポーネント。
- `components/organisms/`: Atomic Design の有機体に該当する純粋な UI コンポーネント。
- `components/features/`: 特定の機能に特化した複合コンポーネント。
- `lib/`: 共通のヘルパー関数のユーティリティ
- `hooks/`: 再利用可能なカスタムフックを配置。
- `store/`：reduxで管理するsliceやapiを配置
- `store/services/`：クライアントサイドAPI群（RTK Query）
- `middleware`：URL正規化とcanonical用のURL生成などを実行するミドルウェア。

## Redux Store の管理構造

```
store/
├── features/
│ ├── sample/ # sample機能slice
│ ├── samle2/ # sample2機能slice
│ └── etc....
└── services/ # クライアントサイドAPI群
```

**命名規則:**

- **Slice:** `[機能名]Slice.ts` (例: `authSlice.ts`)
- **API:** `[機能名]Api.ts` (例: `musicApi.ts`)
- **型定義:** `[機能名]Types.ts` (例: `authTypes.ts`)
- **インターフェース:** `I[名前]` (例: `IUser`, `IMusicTrack`)

# 主要な機能とロジック (Key Features and Logic)

- **データ取得:** 既存のバックエンド API と、Kuroco CMS から API 経由でデータを取得します。サーバサイドはnext.jsの標準fetchを利用。クライアントサイドはRedux(rtkQuery)で取得します。
- **認証:** 未実装です。（または、〇〇というライブラリで実装）
- **状態管理:** グローバルな状態は Redux（Redux Toolkit）で管理します。ストアは`store/`ディレクトリにあります。

# コーディング規約とスタイルガイド (Coding Conventions)

- **リンター/フォーマッター:** ESLint と Prettier を使用しています。設定はリポジトリのルートにある設定ファイルに従ってください。
- **コンポーネント:** 関数コンポーネントと React Hooks を使用します。クラスコンポーネントは使用しません。
- **命名規則:** コンポーネントはパスカルケース (`MyComponent`)、関数や変数はキャメルケース (`myFunction`) です。
  インターフェース定義は、Iプレフィックを付与します。（`IInterfaceName`）。

# API 仕様の概要 (API Overview)

- **CMS エンドポイント:**
  ※以下CMSのエンドポイントは仮です。未定なのでのちほど修正します。
  - `information`: お知らせ情報

- **主要なフィールド:**
  <!-- - ブログ記事は `title`, `content` (リッチエディタ), `slug`, `eyecatch` (画像) のフィールドを持ちます。 -->

# 環境変数 (Environment Variables)

## 設定ファイル

- **開発環境:** `.env.local`
- **本番環境:** `.env.production`

**⚠️ セキュリティ注意:** 実際のキーやパスワードなどの機密情報は絶対に記載しないでください。

## 環境変数一覧

### 🌐 サイト設定

| 変数名                 | 必須 | 説明            | 例                             |
| ---------------------- | ---- | --------------- | ------------------------------ |
| `NEXT_PUBLIC_SITE_URL` | ✅   | サイトの公開URL | `https://joysound.example.com` |

### 🔌 Kuroco CMS 連携

| 変数名                | 必須 | 説明                      | 例                               |
| --------------------- | ---- | ------------------------- | -------------------------------- |
| `KUROCO_API_BASE_URL` | ✅   | Kuroco CMS APIのベースURL | `https://your-kuroco.kuroco.app` |
| `KUROCO_API_KEY`      | ✅   | Kuroco CMS API認証キー    | `your_secret_api_key`            |

### ⚡ キャッシュ・ISR設定

| 変数名                      | 必須 | 説明                          | 例                    |
| --------------------------- | ---- | ----------------------------- | --------------------- |
| `REVALIDATION_SECRET_TOKEN` | ✅   | オンデマンドISR用秘密トークン | `your_webhook_secret` |

## 設定例テンプレート

```bash
# .env.local (開発環境用)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
KUROCO_API_BASE_URL=https://dev.kuroco.app
KUROCO_API_KEY=dev_api_key_here
REVALIDATION_SECRET_TOKEN=dev_webhook_secret
```

```bash
# .env.production (本番環境用)
NEXT_PUBLIC_SITE_URL=https://joysound.example.com
KUROCO_API_BASE_URL=https://prod.kuroco.app
KUROCO_API_KEY=prod_api_key_here
REVALIDATION_SECRET_TOKEN=prod_webhook_secret
```

#git commit メッセージルール

## 機能・修正系

- **feat:** 新機能の追加
- **fix:** バグ修正
- **hotfix:** 緊急バグ修正

## ドキュメント・設定系

- **docs:** ドキュメントの変更
- **style:** コードフォーマット（機能に影響しない）
- **refactor:** リファクタリング（機能変更なし）

## テスト・ツール系

- **test:** テストの追加・修正
- **chore:** ビルドプロセス・補助ツールの変更
- **ci:** CI設定ファイルの変更

## パフォーマンス・リリース系

- **perf:** パフォーマンス改善
- **build:** ビルドシステムの変更
- **revert:** 以前のコミットを取り消し
