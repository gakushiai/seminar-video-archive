import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { X, Search, SortAsc, SortDesc, FileSpreadsheet, Grid, Table2, UserCog } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFirestore } from "@/hooks/use-firestore";
import { useAuth, type UserRole } from "@/hooks/use-auth";
import type { Video } from "@/data/videos";
import VideoCard from "@/components/VideoCard";
import { exportToXLSX, parseYouTubeUrl, getYouTubeThumbnailUrl } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface User {
  id: string;
  email: string | null;
  role: UserRole;
  discordId: string | null;
  createdAt: string;
}

type SortField = "title" | "date" | "category";
type SortOrder = "asc" | "desc";
type ViewMode = "grid" | "table";

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, userRole, loading, getDefaultRole, setDefaultRole, updateDiscordId } = useAuth();
  const {
    getVideos,
    addVideo,
    deleteVideo,
    updateVideo,
    getCategories: fetchCategories,
    addCategory: addFirestoreCategory,
    removeCategory: removeFirestoreCategory,
    getAllUsers,
    updateUserRole,
    updateUserDiscordId,
    deleteUsers,
  } = useFirestore();

  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    url: "",
    category: "",
    tags: [] as string[],
    date: new Date().toISOString().split("T")[0],
  });
  const [newTag, setNewTag] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userSearchField, setUserSearchField] = useState<"email" | "discordId">("email");
  const [newDiscordId, setNewDiscordId] = useState("");
  const [isEditingDiscordId, setIsEditingDiscordId] = useState(false);
  const [defaultRole, setDefaultRoleState] = useState<UserRole>("visitor");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isDeleteUsersDialogOpen, setIsDeleteUsersDialogOpen] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      const fetchedVideos = await getVideos();
      const fetchedCategories = await fetchCategories();
      const currentDefaultRole = await getDefaultRole();
      
      setVideos(fetchedVideos);
      setCategories(fetchedCategories);
      setDefaultRoleState(currentDefaultRole);
      
      if (fetchedCategories.length > 0) {
        setNewVideo(prev => ({ ...prev, category: fetchedCategories[0] }));
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        const formattedUsers: User[] = fetchedUsers.map(user => ({
          id: user.id,
          email: user.email,
          role: user.role,
          discordId: user.discordId || null,
          createdAt: user.createdAt
        }));
        setUsers(formattedUsers);
      } catch (error) {
        console.error("ユーザー情報の取得に失敗しました:", error);
        toast({
          title: "エラー",
          description: "ユーザー情報の取得に失敗しました",
          variant: "destructive",
        });
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { videoId, type, firstVideoId } = parseYouTubeUrl(newVideo.url);
      if (!videoId || !type) {
        throw new Error("Invalid YouTube URL");
      }

      // サムネイルURLを取得
      const thumbnailUrl = getYouTubeThumbnailUrl(
        videoId,
        type,
        firstVideoId
      );

      if (editingVideo) {
        // 編集モード
        const videoToUpdate = {
          ...editingVideo,
          title: newVideo.title,
          description: newVideo.description,
          url: newVideo.url,
          category: newVideo.category,
          tags: newVideo.tags,
          date: newVideo.date,
          thumbnailUrl,
          type, // 動画タイプも保存
        };

        await updateVideo(videoToUpdate);
        setVideos(videos.map(v => v.id === videoToUpdate.id ? videoToUpdate : v));

        toast({
          title: "成功",
          description: "動画が正常に更新されました",
        });

        setEditingVideo(null);
      } else {
        // 新規追加モード
        const videoToAdd = {
          id: (videos.length + 1).toString(),
          ...newVideo,
          thumbnailUrl,
          type, // 動画タイプも保存
        };

        await addVideo(videoToAdd);
        setVideos([...videos, videoToAdd]);

        toast({
          title: "成功",
          description: "動画が正常に追加されました",
        });
      }

      setNewVideo({
        title: "",
        description: "",
        url: "",
        category: categories[0] || "",
        tags: [],
        date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      toast({
        title: "エラー",
        description: editingVideo ? "動画の更新に失敗しました" : "YouTubeのURLが正しくありません",
        variant: "destructive",
      });
    }
  };

  const handleAddTag = () => {
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

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        await addFirestoreCategory(newCategory.trim());
        setCategories([...categories, newCategory.trim()]);
        setNewCategory("");
        toast({
          title: "成功",
          description: "新しいカテゴリーが追加されました",
        });
      } catch (error) {
        toast({
          title: "エラー",
          description: "カテゴリーの追加に失敗しました",
          variant: "destructive",
        });
      }
    }
  };

  const handleRemoveCategory = async (category: string) => {
    try {
      await removeFirestoreCategory(category);
      setCategories(categories.filter(c => c !== category));
      toast({
        title: "成功",
        description: "カテゴリーが削除されました",
      });
    } catch (error) {
      toast({
        title: "エラー",
        description: "カテゴリーの削除に失敗しました",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVideo = async (video: Video) => {
    setVideoToDelete(video);
  };

  const confirmDelete = async () => {
    if (videoToDelete) {
      try {
        await deleteVideo(videoToDelete.id);
        setVideos(videos.filter(v => v.id !== videoToDelete.id));
        toast({
          title: "成功",
          description: "動画が正常に削除されました",
        });
      } catch (error) {
        toast({
          title: "エラー",
          description: "動画の削除に失敗しました",
          variant: "destructive",
        });
      }
      setVideoToDelete(null);
    }
  };

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video);
    setNewVideo({
      title: video.title,
      description: video.description,
      url: video.url,
      category: video.category,
      tags: video.tags,
      date: video.date,
    });
  };

  const handleCancelEdit = () => {
    setEditingVideo(null);
    setNewVideo({
      title: "",
      description: "",
      url: "",
      category: categories[0] || "",
      tags: [],
      date: new Date().toISOString().split("T")[0],
    });
  };

  const getFilteredAndSortedVideos = () => {
    let filtered = [...videos];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        video =>
          video.title.toLowerCase().includes(query) ||
          video.description.toLowerCase().includes(query) ||
          video.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(video => video.category === selectedCategory);
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  };

  const handleExportXLSX = () => {
    const blob = exportToXLSX(videos);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `videos_${new Date().toISOString().split("T")[0]}.xlsx`;
    link.click();
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast({
        title: "成功",
        description: "ユーザーロールを更新しました",
      });
    } catch (error) {
      console.error("ロールの更新に失敗しました:", error);
      toast({
        title: "エラー",
        description: "ロールの更新に失敗しました",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const searchQuery = userSearchQuery.toLowerCase();
    if (userSearchField === "email") {
      return user.email?.toLowerCase().includes(searchQuery) || false;
    } else {
      return user.discordId?.toLowerCase().includes(searchQuery) || false;
    }
  });

  const handleDiscordIdUpdate = async () => {
    if (!user) return;
    try {
      await updateDiscordId(user.uid, newDiscordId);
      setUsers(users.map(u => u.id === user.uid ? { ...u, discordId: newDiscordId } : u));
      setIsEditingDiscordId(false);
      toast({
        title: "成功",
        description: "Discord IDを更新しました",
      });
    } catch (error) {
      console.error("Discord IDの更新に失敗しました:", error);
      toast({
        title: "エラー",
        description: "Discord IDの更新に失敗しました",
        variant: "destructive",
      });
    }
  };

  const handleDefaultRoleChange = async (newRole: UserRole) => {
    try {
      const result = await setDefaultRole(newRole);
      if (result.success) {
        setDefaultRoleState(newRole);
        toast({
          title: "成功",
          description: "デフォルトロールを更新しました",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("デフォルトロールの更新に失敗しました:", error);
      toast({
        title: "エラー",
        description: "デフォルトロールの更新に失敗しました",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUsers = async () => {
    try {
      await deleteUsers(selectedUsers);
      setUsers(users.filter(user => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
      setIsDeleteUsersDialogOpen(false);
      toast({
        title: "成功",
        description: "選択したユーザーを削除しました",
      });
    } catch (error) {
      console.error("ユーザーの削除に失敗しました:", error);
      toast({
        title: "エラー",
        description: "ユーザーの削除に失敗しました",
        variant: "destructive",
      });
    }
  };

  // ロード中は何も表示しない
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>;
  }

  // 未ログインユーザーはログインページにリダイレクト
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // admin以外のユーザーは動画一覧ページにリダイレクト
  if (userRole !== "admin") {
    return <Navigate to="/videos" replace />;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">管理者ページ</h1>
        <div className="space-x-4">
          <Button
            variant="outline"
            onClick={() => setIsRoleDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <UserCog className="h-4 w-4" />
            ロール管理
          </Button>
          <Link to="/">
            <Button variant="outline">LPへ戻る</Button>
          </Link>
        </div>
      </div>
      
      {/* ロール管理ダイアログ */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>ユーザーロール管理</DialogTitle>
            <DialogDescription>
              ユーザーのロールとDiscord IDを管理できます
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-2 justify-between items-center">
              <div className="flex gap-2">
                <Select
                  value={userSearchField}
                  onValueChange={(value: "email" | "discordId") => setUserSearchField(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="検索フィールド" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">メールアドレス</SelectItem>
                    <SelectItem value="discordId">Discord ID</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder={userSearchField === "email" ? "メールアドレスで検索..." : "Discord IDで検索..."}
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              {selectedUsers.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteUsersDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  選択したユーザーを削除 ({selectedUsers.length})
                </Button>
              )}
            </div>

            <div className="border rounded-lg">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(filteredUsers.map(u => u.id));
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-4 py-2 text-left">メールアドレス</th>
                    <th className="px-4 py-2 text-left">Discord ID</th>
                    <th className="px-4 py-2 text-left">現在のロール</th>
                    <th className="px-4 py-2 text-left">ロールを変更</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b">
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(u.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, u.id]);
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== u.id));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-2">{u.email}</td>
                      <td className="px-4 py-2">
                        {u.discordId ? (
                          <Badge variant="outline">{u.discordId}</Badge>
                        ) : (
                          <span className="text-gray-400">未設定</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <Badge>{u.role}</Badge>
                      </td>
                      <td className="px-4 py-2">
                        <Select
                          value={u.role}
                          onValueChange={(value: UserRole) => handleRoleChange(u.id, value)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="ロールを選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="visitor">visitor</SelectItem>
                            <SelectItem value="subscriber">subscriber</SelectItem>
                            <SelectItem value="admin">admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* プロフィール情報セクション */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">プロフィール情報</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>メールアドレス</Label>
                <p className="mt-1">{user?.email}</p>
              </div>
              <div>
                <Label>ロール</Label>
                <Badge className="mt-1">{userRole}</Badge>
              </div>
              <div className="col-span-2">
                <Label>Discord ID設定</Label>
                <div className="flex gap-2 mt-1">
                  {isEditingDiscordId ? (
                    <>
                      <Input
                        value={newDiscordId}
                        onChange={(e) => setNewDiscordId(e.target.value)}
                        placeholder="Discord IDを入力..."
                      />
                      <Button onClick={handleDiscordIdUpdate}>保存</Button>
                      <Button variant="outline" onClick={() => setIsEditingDiscordId(false)}>
                        キャンセル
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="py-2">
                        <span>{users.find(u => u.id === user?.uid)?.discordId || "未設定"}</span>
                      </div>
                      <Button variant="outline" onClick={() => {
                        const currentUser = users.find(u => u.id === user?.uid);
                        setNewDiscordId(currentUser?.discordId || "");
                        setIsEditingDiscordId(true);
                      }}>
                        編集
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 新規ユーザーのデフォルト設定 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">新規ユーザーのデフォルト設定</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="defaultRole" className="min-w-[200px]">デフォルトロール</Label>
              <Select
                value={defaultRole}
                onValueChange={(value: UserRole) => handleDefaultRoleChange(value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="デフォルトロールを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visitor">visitor</SelectItem>
                  <SelectItem value="subscriber">subscriber</SelectItem>
                  <SelectItem value="admin">admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-gray-500">
              この設定は新規登録したユーザーに自動的に適用されます。
            </p>
          </div>
        </div>

        {/* カテゴリー管理セクション */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">カテゴリー管理</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="新規カテゴリーを入力..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddCategory}
              >
                追加
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="flex items-center gap-1 text-sm py-1 px-2"
                >
                  {category}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveCategory(category)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* 動画追加/編集フォーム */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editingVideo ? "動画の編集" : "新規動画の追加"}
            </h2>
            {editingVideo && (
              <Button variant="outline" onClick={handleCancelEdit}>
                編集をキャンセル
              </Button>
            )}
          </div>
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">YouTube URL</Label>
              <Input
                id="url"
                type="url"
                value={newVideo.url}
                onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                placeholder="https://youtube.com/watch?v=... または https://youtu.be/..."
                required={!editingVideo}
              />
              <p className="text-sm text-gray-500">
                通常の動画URL、短縮URL（youtu.be）、ライブ配信URL、プレイリストURLに対応しています
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">カテゴリー</Label>
              <Select
                value={newVideo.category}
                onValueChange={(value) => setNewVideo({ ...newVideo, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="カテゴリーを選択" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">公開日</Label>
              <Input
                id="date"
                type="date"
                value={newVideo.date}
                onChange={(e) => setNewVideo({ ...newVideo, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">タグ</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="タグを入力..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTag}>
                  追加
                </Button>
              </div>
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
              {editingVideo ? "動画を更新" : "動画を追加"}
            </Button>
          </form>
        </div>

        {/* 動画一覧セクション */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">登録済み動画一覧</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setViewMode(mode => mode === "grid" ? "table" : "grid")}
                className="flex items-center gap-2"
              >
                {viewMode === "grid" ? (
                  <>
                    <Table2 className="h-4 w-4" />
                    テーブル表示
                  </>
                ) : (
                  <>
                    <Grid className="h-4 w-4" />
                    グリッド表示
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleExportXLSX}
                className="flex items-center gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Excelエクスポート
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="カテゴリーで絞り込み" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべてのカテゴリー</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={sortField}
              onValueChange={(value: SortField) => setSortField(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="ソート項目" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">日付</SelectItem>
                <SelectItem value="title">タイトル</SelectItem>
                <SelectItem value="category">カテゴリー</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setSortOrder(order => order === "asc" ? "desc" : "asc")}
              className="flex items-center gap-2"
            >
              {sortOrder === "asc" ? (
                <>
                  <SortAsc className="h-4 w-4" />
                  昇順
                </>
              ) : (
                <>
                  <SortDesc className="h-4 w-4" />
                  降順
                </>
              )}
            </Button>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredAndSortedVideos().map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  isAdmin={true}
                  onDelete={handleDeleteVideo}
                  onEdit={handleEditVideo}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">サムネイル</th>
                    <th className="px-4 py-2 text-left">タイトル</th>
                    <th className="px-4 py-2 text-left">カテゴリー</th>
                    <th className="px-4 py-2 text-left">公開日</th>
                    <th className="px-4 py-2 text-left">タグ</th>
                    <th className="px-4 py-2 text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredAndSortedVideos().map((video) => (
                    <tr key={video.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-24 h-auto rounded"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <div className="font-medium">{video.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {video.description}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <Badge>{video.category}</Badge>
                      </td>
                      <td className="px-4 py-2">{video.date}</td>
                      <td className="px-4 py-2">
                        <div className="flex flex-wrap gap-1">
                          {video.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditVideo(video)}
                          >
                            編集
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteVideo(video)}
                          >
                            削除
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ユーザー削除確認ダイアログ */}
      <AlertDialog open={isDeleteUsersDialogOpen} onOpenChange={setIsDeleteUsersDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ユーザーの削除</AlertDialogTitle>
            <AlertDialogDescription>
              選択した{selectedUsers.length}人のユーザーをFirestoreから削除してもよろしいですか？
              この操作は取り消せません。
              
              注意: この操作はFirestoreからのみユーザーを削除します。
              認証情報（Authentication）は削除されません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUsers}>削除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!videoToDelete} onOpenChange={() => setVideoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>動画の削除</AlertDialogTitle>
            <AlertDialogDescription>
              「{videoToDelete?.title}」を削除してもよろしいですか？
              この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>削除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;