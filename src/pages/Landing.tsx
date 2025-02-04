import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black relative overflow-hidden">
      {/* 装飾的な背景要素 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,38,44,0.8),rgba(0,0,0,0))]" />
      <div className="absolute w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="container mx-auto px-4 py-32 relative z-10"
      >
        <div className="text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 tracking-tighter [text-shadow:_0_4px_20px_rgb(168_85_247_/_0.4)] leading-none">
              ACLセミナー
            </h1>
            <div className="relative">
              <span className="block text-4xl md:text-6xl font-extrabold text-zinc-200 tracking-tight leading-none">
                アーカイブ
              </span>
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></span>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-2xl text-zinc-300 max-w-2xl mx-auto font-medium tracking-wide"
          >
            過去のセミナーを、いつでも、どこでも。
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="space-y-4 md:space-y-0 md:space-x-6 pt-8"
          >
            <Link to="/videos-auth">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-12 py-8 rounded-xl text-xl font-bold tracking-wide transition-all duration-300 shadow-lg shadow-purple-500/20 hover:scale-105">
                動画を探す
              </Button>
            </Link>
            <Link to="/admin-auth">
              <Button size="lg" variant="outline" className="border-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/10 px-12 py-8 rounded-xl text-xl font-bold tracking-wide transition-all duration-300 backdrop-blur-sm hover:scale-105">
                管理者ページ
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;