import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

interface AuthRouteProps {
  children: ReactNode;
  type: 'video' | 'admin';
}

export const AuthRoute = ({ children, type }: AuthRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth(type);

  useEffect(() => {
    if (!isAuthenticated) {
      const authPath = type === 'video' ? '/videos-auth' : '/admin-auth';
      navigate(authPath, { replace: true });
    }
  }, [isAuthenticated, navigate, type, location.pathname]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}; 