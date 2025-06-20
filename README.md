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
