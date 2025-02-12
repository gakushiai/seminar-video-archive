# セミナー動画アーカイブ

このプロジェクトは、セミナー動画を管理・共有するための Web アプリケーションです。

## セットアップ手順

### 1. リポジトリのクローンと設定

以下の 2 つの方法のいずれかを選択してください：

#### A. GitHub のインポート機能を使用する方法

1. GitHub にログインし、画面右上の「+」ボタン → 「Import repository」を選択
2. 「The URL for your source repository」に以下の URL を入力：
   ```
   https://github.com/gakushiai/seminar-video-archive.git
   ```
3. 「Repository name」に任意のリポジトリ名を入力
4. 「Your new repository details」で非公開(Private)を選択
5. 「Begin import」をクリックしてインポートを開始

#### B. 直接クローンする方法

```bash
# リポジトリをクローン
git clone https://github.com/gakushiai/seminar-video-archive.git
cd seminar-video-archive

# 新しいリポジトリを作成する場合
# 1. GitHubで新しいリポジトリを作成
# 2. リモートリポジトリの変更
git remote remove origin
git remote add origin https://github.com/[あなたの名前]/seminar-video-archive.git
git branch -M main
git push -u origin main
```

### 2. Firebase 設定

1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. 新しいプロジェクトを作成
3. 以下の機能を有効化：

   - Authentication (Email/パスワード認証)
   - Firestore Database

4. Firebase プロジェクトの設定から必要な情報を取得し、`.env`ファイルを作成：

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

5. Firebase CLI をインストールしてプロジェクトを初期化：

```bash
npm install -g firebase-tools
firebase login
firebase init
```

### 3. Netlify デプロイ設定

1. [Netlify](https://www.netlify.com/)でアカウントを作成
2. 新しいサイトを GitHub リポジトリから作成
3. ビルド設定：
   - Build command: `npm run build`
   - Publish directory: `dist`
4. 環境変数の設定：

   - Netlify のサイト設定 → Build & Deploy → Environment variables
   - `.env`ファイルの内容をそれぞれ追加

5. デプロイ：
   - GitHub にプッシュすると自動的にデプロイされます
   - 手動デプロイの場合：
     ```bash
     npm run build
     netlify deploy --prod
     ```

### 4. ローカル開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build
```

## ライセンス

MIT License

Copyright (c) 2025 [gakushiai]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
