import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface PasswordProtectionProps {
  targetPath: string;
}

const PasswordProtection = ({ targetPath }: PasswordProtectionProps) => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 管理者ページのパスワードは固定
    if (targetPath === "/admin" && password === "1111") {
      navigate(targetPath);
      return;
    }

    // 動画一覧のパスワードはローカルストレージから取得
    const videosPassword = localStorage.getItem("videosPassword") || "1111";
    if (password === videosPassword) {
      navigate(targetPath);
    } else {
      toast({
        title: "エラー",
        description: "パスワードが正しくありません",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-youtube-light flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">パスワードを入力してください</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワードを入力"
            className="w-full"
          />
          <Button type="submit" className="w-full">
            確認
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PasswordProtection;