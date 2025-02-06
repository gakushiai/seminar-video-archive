import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Admin from "./pages/Admin";
import VideoPassword from "./pages/VideoPassword";
import AdminPassword from "./pages/AdminPassword";
import NotFound from "./pages/NotFound";
import VideoAuth from "./components/VideoAuth";
import { useAuth } from "./hooks/use-auth";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/videos-auth" />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/videos-auth" element={<VideoAuth />} />
          <Route path="/videos" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/admin-auth" element={<VideoAuth />} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/admin/video-password" element={<ProtectedRoute><VideoPassword /></ProtectedRoute>} />
          <Route path="/admin/admin-password" element={<ProtectedRoute><AdminPassword /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;