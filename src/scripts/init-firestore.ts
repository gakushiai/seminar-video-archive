import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { videos } from "../data/videos";
import * as dotenv from "dotenv";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const initializeFirestore = async () => {
  try {
    // 動画一覧パスワードの初期設定
    await setDoc(doc(db, "passwords", "video_password"), {
      key: "video_password",
      value: "1234"
    });

    // 管理者パスワードの初期設定
    await setDoc(doc(db, "passwords", "admin_password"), {
      key: "admin_password",
      value: "4321"
    });

    // カテゴリーの初期設定
    const initialCategories = ["Programming"];
    for (const category of initialCategories) {
      await setDoc(doc(db, "categories", category), {
        name: category
      });
    }

    // 動画データの初期設定
    for (const video of videos) {
      await setDoc(doc(db, "videos", video.id), video);
    }

    console.log("初期データの設定が完了しました");
  } catch (error) {
    console.error("初期データの設定中にエラーが発生しました:", error);
  }
};

initializeFirestore(); 