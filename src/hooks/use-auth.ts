import { useState, useEffect } from 'react';

type AuthType = 'video' | 'admin';

export const useAuth = (type: AuthType) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (type === 'video') {
      return sessionStorage.getItem('video-auth') === 'true';
    } else {
      return sessionStorage.getItem('admin-auth') === 'true';
    }
  });

  useEffect(() => {
    const checkAuth = () => {
      if (type === 'video') {
        setIsAuthenticated(sessionStorage.getItem('video-auth') === 'true');
      } else {
        setIsAuthenticated(sessionStorage.getItem('admin-auth') === 'true');
      }
    };

    // セッションストレージの変更を監視
    window.addEventListener('storage', checkAuth);
    
    // 直接のセッションストレージ更新を検知するためのカスタムイベント
    window.addEventListener('auth-change', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, [type]);

  return { isAuthenticated };
}; 