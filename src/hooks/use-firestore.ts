import { db } from "@/lib/firebase";
import { collection, doc, getDocs, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { Video } from "@/data/videos";

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
  };
}; 