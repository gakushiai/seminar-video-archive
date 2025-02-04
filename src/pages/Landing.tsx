import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-youtube-light to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-youtube-dark">
            ACLセミナーアーカイブ
          </h1>
          <div className="space-x-4">
            <Link to="/videos-auth">
              <Button size="lg" className="bg-youtube-red hover:bg-red-600">
                動画を探す
              </Button>
            </Link>
            <Link to="/admin-auth">
              <Button size="lg" variant="outline">
                管理者ページ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;