import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { videos } from "@/data/videos";

const Admin = () => {
  const { toast } = useToast();
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    url: "",
    category: "Programming",
  });
  const [videosPassword, setVideosPassword] = useState(localStorage.getItem("videosPassword") || "1111");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const videoId = new URL(newVideo.url).searchParams.get("v");
      if (!videoId) {
        throw new Error("Invalid YouTube URL");
      }

      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      
      const videoToAdd = {
        id: (videos.length + 1).toString(),
        ...newVideo,
        thumbnailUrl,
        date: new Date().toISOString().split("T")[0],
      };

      videos.push(videoToAdd);

      toast({
        title: "成功",
        description: "動画が正常に追加されました",
      });

      setNewVideo({
        title: "",
        description: "",
        url: "",
        category: "Programming",
      });
    } catch (error) {
      toast({
        title: "エラー",
        description: "YouTubeのURLが正しくありません",
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("videosPassword", videosPassword);
    toast({
      title: "成功",
      description: "パスワードが更新されました",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">管理者ページ</h1>
      
      <div className="max-w-2xl mx-auto space-y-8">
        {/* パスワード設定フォーム */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">動画一覧のパスワード設定</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="text"
                value={videosPassword}
                onChange={(e) => setVideosPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit">パスワードを更新</Button>
          </form>
        </div>

        {/* 動画追加フォーム */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">新規動画の追加</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                value={newVideo.title}
                onChange={(e) =>
                  setNewVideo({ ...newVideo, title: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">説明</Label>
              <Textarea
                id="description"
                value={newVideo.description}
                onChange={(e) =>
                  setNewVideo({ ...newVideo, description: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">YouTube URL</Label>
              <Input
                id="url"
                type="url"
                value={newVideo.url}
                onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
                required
              />
            </div>
            <Button type="submit" className="w-full">
              動画を追加
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;