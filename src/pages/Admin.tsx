import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { videos } from "@/data/videos";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    url: "",
    category: "Programming",
    tags: [] as string[],
  });
  const [videosPassword, setVideosPassword] = useState(
    localStorage.getItem("videosPassword") || "1111"
  );
  const [newTag, setNewTag] = useState("");

  const generateRandomPassword = () => {
    const password = Math.floor(1000 + Math.random() * 9000).toString();
    setVideosPassword(password);
    localStorage.setItem("videosPassword", password);
    toast({
      title: "パスワード生成完了",
      description: `新しいパスワード: ${password}`,
    });
  };

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
        tags: [],
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

  const addTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag && !newVideo.tags.includes(newTag)) {
      setNewVideo({
        ...newVideo,
        tags: [...newVideo.tags, newTag],
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewVideo({
      ...newVideo,
      tags: newVideo.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">管理者ページ</h1>
        <div className="space-x-4">
          <Button onClick={() => navigate("/videos")} variant="outline">
            動画一覧へ
          </Button>
          <Link to="/">
            <Button variant="outline">LPへ戻る</Button>
          </Link>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto space-y-8">
        {/* パスワード設定フォーム */}
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
                  ランダム生成
                </Button>
              </div>
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
            <div className="space-y-2">
              <Label htmlFor="tags">タグ</Label>
              <form onSubmit={addTag} className="flex gap-2">
                <Input
                  id="tags"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="タグを入力..."
                />
                <Button type="submit">追加</Button>
              </form>
              <div className="flex flex-wrap gap-2 mt-2">
                {newVideo.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
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