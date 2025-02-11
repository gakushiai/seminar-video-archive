import { db } from "@/lib/firebase";
import { collection, doc, getDocs, setDoc, deleteDoc, getDoc, writeBatch } from "firebase/firestore";
import { Video } from "@/data/videos";
import { getAuth, deleteUser, signInWithEmailAndPassword } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { UserRole } from "./use-auth";

interface User {
  id: string;
  email: string | null;
  role: UserRole;
  discordId: string | null;
  createdAt: string;
}

export const useFirestore = () => {
  const getVideos = async () => {
    const videosRef = collection(db, "videos");
    const snapshot = await getDocs(videosRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
  };

  const addVideo = async (video: Video) => {
    const videoRef = doc(db, "videos", video.id);
    await setDoc(videoRef, video);
  };

  const deleteVideo = async (videoId: string) => {
    const videoRef = doc(db, "videos", videoId);
    await deleteDoc(videoRef);
  };

  const updateVideo = async (video: Video) => {
    const videoRef = doc(db, "videos", video.id);
    await setDoc(videoRef, video);
  };

  const getPassword = async () => {
    const passwordRef = doc(db, "settings", "password");
    const snapshot = await getDoc(passwordRef);
    if (snapshot.exists()) {
      return snapshot.data().value;
    }
    return null;
  };

  const setPassword = async (password: string) => {
    const passwordRef = doc(db, "settings", "password");
    await setDoc(passwordRef, { key: "password", value: password });
  };

  const getAdminPassword = async () => {
    const adminPasswordRef = doc(db, "admin_settings", "admin_password");
    const snapshot = await getDoc(adminPasswordRef);
    if (snapshot.exists()) {
      return snapshot.data().value;
    }
    return null;
  };

  const setAdminPassword = async (password: string) => {
    const adminPasswordRef = doc(db, "admin_settings", "admin_password");
    await setDoc(adminPasswordRef, { key: "admin_password", value: password });
  };

  const getCategories = async () => {
    const categoriesRef = collection(db, "categories");
    const snapshot = await getDocs(categoriesRef);
    return snapshot.docs.map(doc => doc.data().name);
  };

  const addCategory = async (category: string) => {
    const categoryRef = doc(db, "categories", category);
    await setDoc(categoryRef, { name: category });
  };

  const removeCategory = async (category: string) => {
    const categoryRef = doc(db, "categories", category);
    await deleteDoc(categoryRef);
  };

  const getAllUsers = async () => {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  };

  const updateUserRole = async (userId: string, role: User["role"]) => {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { role }, { merge: true });
  };

  const updateUserDiscordId = async (userId: string, discordId: string) => {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { discordId }, { merge: true });
  };

  const deleteUsers = async (userIds: string[]) => {
    const batch = writeBatch(db);
    
    // Firestoreのバッチ処理を準備
    userIds.forEach((userId) => {
      const userRef = doc(db, "users", userId);
      batch.delete(userRef);
    });

    try {
      // Firestoreからユーザーを削除
      await batch.commit();
    } catch (error) {
      console.error("ユーザーの削除に失敗しました:", error);
      throw error;
    }
  };

  return {
    getVideos,
    addVideo,
    deleteVideo,
    updateVideo,
    getPassword,
    setPassword,
    getAdminPassword,
    setAdminPassword,
    getCategories,
    addCategory,
    removeCategory,
    getAllUsers,
    updateUserRole,
    updateUserDiscordId,
    deleteUsers,
  };
}; 