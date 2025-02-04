import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useFirestore } from "@/hooks/use-firestore";

const VideoPassword = () => {
  const { toast } = useToast();
  const {
    getPassword,
    setPassword: setFirestorePassword,
  } = useFirestore();

  const [videosPassword, setVideosPassword] = useState("");

  useEffect(() => {
    const initializeData = async () => {
      const storedPassword = await getPassword();
      if (storedPassword) {
        setVideosPassword(storedPassword);
      }
    };

    initializeData();
  }, []);

  const generateRandomPassword = () => {
    const password = Math.floor(1000 + Math.random() * 9000).toString();
    setVideosPassword(password);
    setFirestorePassword(password);
    toast({
      title: "パスワード生成完了",
      description: `新しい動画一覧パスワード: ${password}`,
    });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (videosPassword.length !== 4 || isNaN(Number(videosPassword))) {
      toast({
        title: "エラー",
        description: "パスワードは4桁の数字である必要があります",
        variant: "destructive",
      });
      return;
    }
    await setFirestorePassword(videosPassword);
    toast({
      title: "成功",
      description: "動画一覧パスワードが更新されました",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">動画一覧パスワード設定</h1>
        <div className="space-x-4">
          <Link to="/admin">
            <Button variant="outline">管理者ページへ</Button>
          </Link>
          <Link to="/">
            <Button variant="outline">LPへ戻る</Button>
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">動画一覧のパスワード設定</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type="text"
                  value={videosPassword}
                  onChange={(e) => setVideosPassword(e.target.value)}
                  required
                />
                <Button type="button" onClick={generateRandomPassword}>
                  ランダム生成で更新
                </Button>
              </div>
            </div>
            <Button type="submit">パスワードを更新</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VideoPassword; 