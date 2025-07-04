# 今日の献立アプリ

Next.js 15を使用して構築された献立管理アプリケーションです。ChatGPT APIを活用して、今日の献立を自動提案し、事前に献立をデータベースに保存することができます。

## 🍽️ 機能

- **今日の献立取得**: データベースに今日の献立がない場合、ChatGPTが自動で健康的な献立を提案
- **画像からの献立抽出**: 📸 料理の写真をアップロードして、AIが自動で献立情報を識別・抽出
- **献立事前登録**: 手動で献立を登録し、データベースに保存
- **献立履歴**: 過去の献立を一覧で確認
- **おしゃれなアニメーション**: ✨ フェードイン、スライド、ホバーエフェクトなどの滑らかなアニメーション
- **レスポンシブデザイン**: モバイルとデスクトップ両方に対応
- **モダンUI**: 絵文字とグラデーションを使用した視覚的に魅力的なインターフェース

## 🛠️ 技術スタック

- **フロントエンド**: Next.js 15, React, TypeScript, Tailwind CSS
- **バックエンド**: Next.js API Routes
- **データベース**: SQLite + Prisma ORM
- **AI**: OpenAI GPT-3.5-turbo (献立生成) + GPT-4o (画像解析)
- **スタイリング**: Tailwind CSS

## 📋 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env`ファイルにOpenAI APIキーを設定してください：

```env
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="your-openai-api-key-here"
```

**重要**: `your-openai-api-key-here`を実際のOpenAI APIキーに置き換えてください。
OpenAI APIキーは[OpenAI Platform](https://platform.openai.com/)で取得できます。

### 3. データベースのセットアップ

```bash
# Prismaクライアントの生成
npx prisma generate

# データベースのマイグレーション（すでに実行済み）
npx prisma migrate dev
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

アプリケーションは [http://localhost:3000](http://localhost:3000) でアクセスできます。

## 📖 使い方

### 今日の献立を取得

1. メインページの「今日の献立」セクションで「新しい献立を取得」ボタンをクリック
2. データベースに今日の献立がない場合、ChatGPTが自動で献立を生成
3. 生成された献立は自動でデータベースに保存されます

### 献立を事前登録

1. 「献立を登録」セクションで「新しい献立を登録」ボタンをクリック
2. フォームに必要な情報を入力：
   - 日付（必須）
   - 主菜（必須）
   - 副菜、汁物、ご飯物（任意）
   - カテゴリ（和食、洋食、中華、その他）
   - 説明（任意）
3. 「献立を登録」ボタンをクリックして保存

### 献立履歴の確認

- メインページの「献立履歴」セクションで過去の献立を確認できます
- 日付順に表示され、各献立の詳細を確認できます

## 🗄️ データベーススキーマ

```prisma
model Menu {
  id          String   @id @default(cuid())
  date        DateTime @unique
  mainDish    String
  sideDish    String?
  soup        String?
  rice        String?
  category    String   @default("和食")
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🔧 API エンドポイント

- `GET /api/menu/today` - 今日の献立を取得（なければChatGPTで生成）
- `GET /api/menu` - 献立一覧を取得
- `POST /api/menu` - 新しい献立を作成

## 🚀 本番環境へのデプロイ

### Vercelでのデプロイ

1. Vercelアカウントでプロジェクトをインポート
2. 環境変数`OPENAI_API_KEY`を設定
3. 自動でビルド・デプロイが実行されます

### その他のプラットフォーム

本番環境では以下の準備が必要です：
- Node.js 18以上
- 環境変数の設定
- データベースのセットアップ

## 🤝 貢献

プルリクエストやイシューの報告を歓迎します。

## 📝 ライセンス

MIT License

## ⚠️ 注意事項

- OpenAI APIの使用には料金が発生する場合があります
- APIキーは絶対に公開リポジトリにコミットしないでください
- `.env`ファイルは`.gitignore`に含まれています

# Chat API Test Application

指定されたチャットAPIを実行するNext.jsアプリケーションです。

## 📋 概要

このアプリケーションは、以下のAPIエンドポイントに対してメッセージを送信する機能を提供します：

- **API URL**: `https://xrvp-5l6a-rpaf.t7.xano.io/api:z1PY1HTu/chat`
- **メソッド**: POST
- **Content-Type**: application/json

## 🚀 使用方法

### 1. 依存関係のインストール

```bash
npm install
```

### 2. アプリケーションの起動

```bash
npm run dev
```

### 3. アプリケーションの使用

#### Web UI（推奨）
1. ブラウザで `http://localhost:3000/chat-test` を開く
2. フォームに値を入力してメッセージを送信
3. レスポンスが画面に表示される

#### APIエンドポイント直接呼び出し

**テストメッセージ送信 (GET)**
```bash
curl http://localhost:3000/api/chat
```

**カスタムメッセージ送信 (POST)**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"text":"こんにちは！これはテストメッセージです。","channel":"general","user":"demo_user","mention":"@everyone","date":"2024-01-01T12:00:00.000Z"}'
```

#### テストスクリプト実行
```bash
node test/api-test.js
```

## 📁 ファイル構成

```
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts        # APIルートハンドラー
│   └── chat-test/
│       └── page.tsx            # UIテストページ
├── lib/
│   └── chatApi.ts              # APIクライアント
├── test/
│   └── api-test.js             # テストスクリプト
└── README.md                   # このファイル
```

## ✅ テスト結果

すべてのテストが正常に実行され、以下の機能が確認されています：

1. **GETリクエストテスト** - テストメッセージの送信 ✅
2. **POSTリクエストテスト** - カスタムメッセージの送信 ✅
3. **並列送信テスト** - 複数メッセージの同時送信 ✅
4. **エラーハンドリング** - 無効なデータの処理 ✅
5. **UIページテスト** - ブラウザインターフェース ✅

## 🔧 技術スタック

- **Next.js 15** - React フレームワーク
- **TypeScript** - 型安全なJavaScript
- **Tailwind CSS** - UIスタイリング
- **Fetch API** - HTTP クライアント

## 📊 API レスポンス例

```json
{
  "id": 239,
  "created_at": 1751608957870,
  "text": "こんにちは！これはテストメッセージです。",
  "channel": "general",
  "user": "demo_user",
  "mention": "@everyone",
  "date": "2025-07-04T06:02:37.576Z"
}
```

## 🎯 主な機能

1. **APIクライアント** (`lib/chatApi.ts`)
   - 外部APIとの通信を担当
   - エラーハンドリング機能付き

2. **APIルート** (`app/api/chat/route.ts`)
   - GET/POSTリクエストの処理
   - サーバーサイドでのAPI呼び出し

3. **UIテストページ** (`app/chat-test/page.tsx`)
   - ブラウザベースのテストインターフェース
   - リアルタイムでのレスポンス表示

4. **テストスクリプト** (`test/api-test.js`)
   - 自動テストの実行
   - 包括的なテストケース

## 🌐 アクセス方法

アプリケーション起動後、以下のURLでアクセスできます：

- **UIテストページ**: http://localhost:3000/chat-test
- **API GET**: http://localhost:3000/api/chat
- **API POST**: http://localhost:3000/api/chat

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
