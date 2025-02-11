import { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useEffect } from "react";
import { app } from "@/lib/firebase";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

export type UserRole = "visitor" | "subscriber" | "admin";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const getDefaultRole = async () => {
    try {
      const defaultRoleDoc = await getDoc(doc(db, "settings", "defaultRole"));
      if (defaultRoleDoc.exists()) {
        return defaultRoleDoc.data().role as UserRole;
      }
      // デフォルトロールが設定されていない場合は、visitorを返す
      await setDoc(doc(db, "settings", "defaultRole"), {
        role: "visitor" as UserRole,
        updatedAt: new Date().toISOString(),
      });
      return "visitor" as UserRole;
    } catch (error) {
      console.error("デフォルトロールの取得に失敗しました:", error);
      return "visitor" as UserRole;
    }
  };

  const setDefaultRole = async (role: UserRole) => {
    try {
      await setDoc(doc(db, "settings", "defaultRole"), {
        role,
        updatedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  };

  const getUserRole = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return userDoc.data().role as UserRole;
      }
      // ドキュメントが存在しない場合は、デフォルトロールを取得して設定する
      const defaultRole = await getDefaultRole();
      const currentUser = auth.currentUser;
      
      await setDoc(doc(db, "users", uid), {
        email: currentUser?.email,
        discordId: null,
        role: defaultRole,
        createdAt: new Date().toISOString(),
      });
      return defaultRole;
    } catch (error) {
      console.error("ロールの取得に失敗しました:", error);
      return "visitor" as UserRole;
    }
  };

  const updateDiscordId = async (uid: string, discordId: string) => {
    try {
      await setDoc(doc(db, "users", uid), {
        discordId,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const role = await getUserRole(user.uid);
        setUserRole(role);
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const role = await getUserRole(result.user.uid);
      setUserRole(role);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  };

  const register = async (email: string, password: string, discordId: string | null = null) => {
    try {
      console.log("新規ユーザー登録を開始します");
      console.log("入力値確認 - Email:", email, "DiscordID:", discordId);
      
      // Discord IDの前処理（任意項目）
      const trimmedDiscordId = discordId ? discordId.trim() : null;
      console.log("DiscordID確認:", trimmedDiscordId);

      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Authentication登録完了:", result.user.uid);

      const defaultRole = await getDefaultRole();
      console.log("デフォルトロール取得完了:", defaultRole);

      const userData = {
        email: result.user.email,
        discordId: trimmedDiscordId,
        role: defaultRole,
        createdAt: new Date().toISOString()
      };
      console.log("保存するユーザーデータ:", JSON.stringify(userData, null, 2));

      try {
        const userDocRef = doc(db, "users", result.user.uid);
        await setDoc(userDocRef, userData, { merge: true });
        console.log("Firestoreへの保存完了 - ユーザーID:", result.user.uid);
        
        // 保存後のデータを確認
        const savedDoc = await getDoc(userDocRef);
        console.log("保存されたデータ:", JSON.stringify(savedDoc.data(), null, 2));
      } catch (firestoreError) {
        console.error("Firestore保存エラー:", firestoreError);
        throw firestoreError;
      }

      setUserRole(defaultRole);
      return { success: true };
    } catch (error: any) {
      console.error("ユーザー登録エラー:", error);
      // Authenticationのユーザーを削除（ロールバック）
      if (auth.currentUser) {
        try {
          await auth.currentUser.delete();
          console.log("Authentication登録をロールバックしました");
        } catch (deleteError) {
          console.error("ロールバック失敗:", deleteError);
        }
      }
      return {
        success: false,
        error: error.message,
      };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserRole(null);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    register,
    resetPassword,
    userRole,
    getDefaultRole,
    setDefaultRole,
    updateDiscordId,
  };
}; 