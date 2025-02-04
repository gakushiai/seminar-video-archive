import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useFirestore } from "@/hooks/use-firestore";
import { useLocation } from "react-router-dom";

interface PasswordProtectionProps {
  onSuccess: () => void;
}

export const PasswordProtection = ({ onSuccess }: PasswordProtectionProps) => {
  const [password, setPassword] = useState("");
  const [correctPassword, setCorrectPassword] = useState("");
  const { toast } = useToast();
  const { getPassword, getAdminPassword } = useFirestore();
  const location = useLocation();

  useEffect(() => {
    const fetchPassword = async () => {
      // パスのパターンに基づいて適切なパスワードを取得
      const storedPassword = location.pathname.includes('admin') 
        ? await getAdminPassword()
        : await getPassword();
      
      if (storedPassword) {
        setCorrectPassword(storedPassword);
      }
    };

    fetchPassword();
  }, [location.pathname]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      onSuccess();
    } else {
      toast({
        title: "エラー",
        description: "パスワードが正しくありません",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <div className="w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">
          {location.pathname.includes('admin') 
            ? "管理者パスワードを入力してください"
            : "パスワードを入力してください"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワードを入力..."
            required
          />
          <Button type="submit" className="w-full">
            確認
          </Button>
        </form>
      </div>
    </div>
  );
};