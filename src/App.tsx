import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Admin from "./pages/Admin";
import VideoPassword from "./pages/VideoPassword";
import AdminPassword from "./pages/AdminPassword";
import NotFound from "./pages/NotFound";
import { PasswordProtection } from "./components/PasswordProtection";
import { AuthRoute } from "./components/AuthRoute";

const queryClient = new QueryClient();

const VideosAuth = () => {
  const navigate = useNavigate();
  return <PasswordProtection onSuccess={() => {
    sessionStorage.setItem('video-auth', 'true');
    window.dispatchEvent(new Event('auth-change'));
    navigate("/videos");
  }} />;
};

const AdminAuth = () => {
  const navigate = useNavigate();
  return <PasswordProtection onSuccess={() => {
    sessionStorage.setItem('admin-auth', 'true');
    window.dispatchEvent(new Event('auth-change'));
    navigate("/admin");
  }} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/videos-auth" element={<VideosAuth />} />
          <Route path="/videos" element={<AuthRoute type="video"><Index /></AuthRoute>} />
          <Route path="/admin-auth" element={<AdminAuth />} />
          <Route path="/admin" element={<AuthRoute type="admin"><Admin /></AuthRoute>} />
          <Route path="/admin/video-password" element={<AuthRoute type="admin"><VideoPassword /></AuthRoute>} />
          <Route path="/admin/admin-password" element={<AuthRoute type="admin"><AdminPassword /></AuthRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;