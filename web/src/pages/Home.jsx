import { Link } from "react-router-dom";
import { Users, FolderRoot, HelpCircle, Gamepad2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Home = () => {
  const cards = [
    {
      title: "Users",
      text: "Quản lý người chơi và hồ sơ cá nhân với giao diện trực quan.",
      to: "/users",
      icon: Users,
      color: "from-blue-500 to-cyan-400",
    },
    {
      title: "Groups",
      text: "Khởi tạo nhóm, kết nối bạn bè và đồng nghiệp dễ dàng.",
      to: "/groups",
      icon: FolderRoot,
      color: "from-purple-500 to-pink-400",
    },
    {
      title: "Questions",
      text: "Kho tàng câu hỏi đa dạng, gợi mở những cuộc đối thoại sâu sắc.",
      to: "/questions",
      icon: HelpCircle,
      color: "from-orange-500 to-amber-400",
    },
    {
      title: "Games",
      text: "Bắt đầu trải nghiệm kết nối ngay lập tức với các game thú vị.",
      to: "/games",
      icon: Gamepad2,
      color: "from-emerald-500 to-teal-400",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500 tracking-tight"
        >
          DeepTalk Playground
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-400 max-w-2xl mx-auto"
        >
          Kiến tạo không gian kết nối chân thành. Khám phá những câu chuyện
          đằng sau mỗi người bạn qua những trò chơi thú vị.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
            whileHover={{ y: -5 }}
            className="group relative"
          >
            <div className="glass-card p-8 h-full flex flex-col">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${card.color} shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                {card.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
                {card.text}
              </p>
              <Link
                to={card.to}
                className="flex items-center gap-2 text-sm font-bold text-accent-primary group-hover:text-accent-secondary transition-colors"
              >
                Khám phá ngay
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;
