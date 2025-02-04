import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useFirestore } from "@/hooks/use-firestore";

const AdminPassword = () => {
  const { toast } = useToast();
  const {
    getAdminPassword,
    setAdminPassword: setFirestoreAdminPassword,
  } = useFirestore();

  const [adminPassword, setAdminPassword] = useState("");

  useEffect(() => {
    const initializeData = async () => {
      const storedAdminPassword = await getAdminPassword();
      if (storedAdminPassword) {
        setAdminPassword(storedAdminPassword);
      }
    };

    initializeData();
  }, []);

  const handleAdminPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword.length !== 4 || isNaN(Number(adminPassword))) {
      toast({
        title: "エラー",
        description: "管理者パスワードは4桁の数字である必要があります",
        variant: "destructive",
      });
      return;
    }
    await setFirestoreAdminPassword(adminPassword);
    toast({
      title: "成功",
      description: "管理者パスワードが更新されました",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">管理者パスワード設定</h1>
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
          <h2 className="text-xl font-semibold mb-4">管理者パスワード設定</h2>
          <form onSubmit={handleAdminPasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminPassword">管理者パスワード</Label>
              <div className="flex gap-2">
                <Input
                  id="adminPassword"
                  type="text"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit">管理者パスワードを更新</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPassword; 