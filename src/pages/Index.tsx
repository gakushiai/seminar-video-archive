import { useState, useMemo, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import VideoCard from "@/components/VideoCard";
import { useFirestore } from "@/hooks/use-firestore";
import { useAuth } from "@/hooks/use-auth";
import type { Video } from "@/data/videos";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isEditingDiscordId, setIsEditingDiscordId] = useState(false);
  const [discordId, setDiscordId] = useState<string | null>(null);
  const { getVideos, getCategories, updateUserDiscordId } = useFirestore();
  const { user, userRole, loading } = useAuth();

  const filteredVideos = useMemo(() => {
    let filtered = [...videos];

    if (searchQuery) {
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.tags.some(tag => 
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((video) => video.category === selectedCategory);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, sortBy, videos]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedVideos, fetchedCategories] = await Promise.all([
          getVideos(),
          getCategories()
        ]);
        setVideos(fetchedVideos);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
      }
    };

    if (userRole === "subscriber" || userRole === "admin") {
      fetchData();
    }
  }, [userRole]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setDiscordId(userDoc.data().discordId);
        }
      } catch (error) {
        console.error("ユーザーデータの取得に失敗しました:", error);
      }
    };

    fetchUserData();
  }, [user]);

  const handleDiscordIdUpdate = async () => {
    if (!user || !discordId) return;
    try {
      await updateUserDiscordId(user.uid, discordId);
      setIsEditingDiscordId(false);
    } catch (error) {
      console.error("DiscordIDの更新に失敗しました:", error);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (userRole === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (userRole === "visitor") {
      return (
        <div className="min-h-screen bg-youtube-light">
          <div className="container mx-auto py-8 space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold text-center">Video Collection</h1>
              <Link to="/">
                <Button variant="outline">LPへ戻る</Button>
              </Link>
            </div>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>アクセス制限</AlertTitle>
              <AlertDescription>
                この機能は有料会員限定です。管理者に連絡して、有料会員（subscriber）ロールの付与をリクエストしてください。
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-youtube-light">
        <div className="container mx-auto py-8 space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-center">Video Collection</h1>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  現在のロール: {userRole === "admin" ? "管理者" : userRole === "subscriber" ? "有料会員" : "ビジター"}
                </p>
                <p className="text-sm text-gray-600">
                  メールアドレス: {user?.email}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600">
                    Discord ID: {isEditingDiscordId ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          value={discordId || ""}
                          onChange={(e) => setDiscordId(e.target.value)}
                          className="w-48"
                        />
                        <Button onClick={handleDiscordIdUpdate} size="sm">保存</Button>
                        <Button onClick={() => setIsEditingDiscordId(false)} variant="outline" size="sm">キャンセル</Button>
                      </div>
                    ) : (
                      <>
                        <span>{discordId || "未設定"}</span>
                        <Button onClick={() => setIsEditingDiscordId(true)} variant="outline" size="sm" className="ml-2">編集</Button>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <Link to="/">
              <Button variant="outline">LPへ戻る</Button>
            </Link>
          </div>
          <SearchBar onSearch={setSearchQuery} />
          <FilterBar
            onCategoryChange={setSelectedCategory}
            onSortChange={setSortBy}
            categories={categories}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
          {filteredVideos.length === 0 && (
            <p className="text-center text-gray-500">動画が見つかりませんでした</p>
          )}
        </div>
      </div>
    );
  };

  return renderContent();
};

export default Index;