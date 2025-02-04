import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-youtube-light to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-youtube-dark">
            プログラミング学習の
            <span className="text-youtube-red">ベストな動画</span>
            を見つけよう
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            厳選されたプログラミング学習動画を効率的に探索できるプラットフォーム
          </p>
          <div className="space-x-4">
            <Link to="/videos">
              <Button size="lg" className="bg-youtube-red hover:bg-red-600">
                動画を探す
              </Button>
            </Link>
            <Link to="/admin">
              <Button size="lg" variant="outline">
                管理者ページ
              </Button>
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">厳選コンテンツ</h3>
              <p className="text-gray-600">
                プロフェッショナルが選んだ質の高い学習動画
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">効率的な学習</h3>
              <p className="text-gray-600">
                カテゴリー別に整理された動画で効率的に学習
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">最新コンテンツ</h3>
              <p className="text-gray-600">
                定期的に更新される最新のプログラミング動画
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;