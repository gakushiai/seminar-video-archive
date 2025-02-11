import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const VideoAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [discordId, setDiscordId] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const { login, register, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = isRegistering
      ? await register(email, password, discordId)
      : await login(email, password);
    
    if (result.success) {
      navigate("/videos");
    } else {
      toast({
        title: "エラー",
        description: isRegistering
          ? "アカウントの作成に失敗しました"
          : "メールアドレスまたはパスワードが正しくありません",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast({
        title: "エラー",
        description: "メールアドレスを入力してください",
        variant: "destructive",
      });
      return;
    }

    const result = await resetPassword(email);
    if (result.success) {
      toast({
        title: "送信完了",
        description: "パスワードリセットのメールを送信しました",
      });
    } else {
      toast({
        title: "エラー",
        description: "パスワードリセットメールの送信に失敗しました",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(244,244,245,0.8),rgba(255,255,255,0))]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10 p-4"
      >
        <Card className="p-8 shadow-xl bg-white/80 backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-center mb-6">
            {isRegistering ? "新規アカウント作成" : "動画アーカイブにログイン"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@acl.com"
              />
            </div>
            {isRegistering && (
              <div className="space-y-2">
                <Label htmlFor="discordId">Discord ID（任意）</Label>
                <Input
                  id="discordId"
                  type="text"
                  value={discordId}
                  onChange={(e) => setDiscordId(e.target.value)}
                  placeholder="例: example#1234"
                  aria-label="Discord ID（任意の入力項目です）"
                  aria-required="false"
                />
                <p className="text-sm text-gray-500">
                  Discord IDの登録は任意です。後からマイページで設定することもできます。
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full">
              {isRegistering ? "アカウントを作成" : "ログイン"}
            </Button>
          </form>

          <div className="mt-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering
                ? "既存のアカウントでログイン"
                : "新規アカウントを作成"}
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="link" className="w-full">
                  パスワードを忘れた場合
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>パスワードのリセット</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    登録したメールアドレスを入力してください。
                    パスワードリセットのリンクを送信します。
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">メールアドレス</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@acl.com"
                    />
                  </div>
                  <Button onClick={handleResetPassword} className="w-full">
                    リセットメールを送信
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default VideoAuth; 