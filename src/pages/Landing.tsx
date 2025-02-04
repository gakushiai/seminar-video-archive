import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* 装飾的な背景要素 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(244,244,245,0.8),rgba(255,255,255,0))]" />
      <div className="absolute w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-100 blur-3xl opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100 blur-3xl opacity-60" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="container mx-auto px-4 py-32 relative z-10"
      >
        <Card className="max-w-4xl mx-auto p-8 shadow-xl bg-white/80 backdrop-blur-sm border-0">
          <div className="text-center space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-7xl font-black text-zinc-900 tracking-tighter leading-none">
                ACL<span className="text-purple-600">セミナー</span>
              </h1>
              <div className="relative">
                <span className="block text-3xl md:text-5xl font-extrabold text-zinc-800 tracking-tight leading-none">
                  アーカイブ
                </span>
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></span>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-2xl text-zinc-600 max-w-2xl mx-auto font-medium tracking-wide"
            >
              過去のセミナーを、いつでも、どこでも。
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-col md:flex-row gap-4 justify-center items-center pt-8"
            >
              <Link to="/videos-auth">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-lg text-lg font-semibold tracking-wide transition-all duration-300 shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:translate-y-[-2px]">
                  動画を探す
                </Button>
              </Link>
              <Link to="/admin-auth">
                <Button size="lg" variant="outline" className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 px-8 py-6 rounded-lg text-lg font-semibold tracking-wide transition-all duration-300 hover:translate-y-[-2px]">
                  管理者ページ
                </Button>
              </Link>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Landing;