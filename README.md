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

6. Firestore のセキュリティルールを設定：

以下のルールを Firebase Console の Firestore セキュリティルールに貼り付けてください：

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }

    function isAdmin() {
      return isAuthenticated() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    function isSubscriber() {
      return isAuthenticated() &&
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        (
          get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'subscriber' ||
          get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
        );
    }

    // videosコレクションは認証済みユーザーのみ読み取り可能、管理者のみ書き込み可能
    match /videos/{videoId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    // usersコレクションは認証済みユーザーのみアクセス可能
    // ただし、自分のドキュメントの作成は許可
    match /users/{userId} {
      allow read: if isAuthenticated() && (request.auth.uid == userId || isAdmin());
      allow create: if isAuthenticated() &&
        request.auth.uid == userId &&
        request.resource.data.keys().hasAll(['email', 'role', 'createdAt']) &&
        (request.resource.data.discordId == null || request.resource.data.discordId is string);
      allow update: if isAdmin() ||
        (request.auth.uid == userId &&
         request.resource.data.diff(resource.data).affectedKeys().hasOnly(['idType', 'customId']) &&
         request.resource.data.idType in ['discord', 'twitter', 'custom'] &&
         (request.resource.data.customId == null || request.resource.data.customId is string));
      allow delete: if isAdmin();
    }

    // settingsコレクションのpasswordドキュメントは管理者のみアクセス可能
    match /settings/password {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    // settingsコレクションのdefaultRoleドキュメントは管理者のみアクセス可能
    match /settings/defaultRole {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    // settingsコレクションのdefaultIdTypeドキュメントは管理者のみアクセス可能
    match /settings/defaultIdType {
      allow read: if isAuthenticated();
      allow write: if isAdmin() &&
        request.resource.data.keys().hasAll(['idType', 'updatedAt']) &&
        request.resource.data.idType in ['discord', 'twitter', 'custom'];
    }

    // admin_settingsコレクションのadmin_passwordドキュメントは管理者のみアクセス可能
    match /admin_settings/admin_password {
      allow read, write: if isAdmin();
    }

    // categoriesコレクションは認証済みユーザーのみ読み取り可能、管理者のみ書き込み可能
    match /categories/{categoryId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
  }
}
```

これらのルールは以下のセキュリティ設定を実装します：

- 認証済みユーザーのみがデータにアクセス可能
- 管理者ユーザーのみが動画の追加・編集・削除が可能
- ユーザーは自身のプロフィール情報のみ編集可能
- カテゴリーの管理は管理者のみ可能

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
