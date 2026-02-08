import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Play, ChevronRight, Trophy, Info, User as UserIcon, HelpCircle, Loader2, AlertCircle, Gamepad2 } from "lucide-react";
import { startGameAPI, nextTurnAPI, getGroupsAPI, getTopicsAPI } from "../app/api";

const GamePage = () => {
  const [form, setForm] = useState({ groupId: "", topicId: "all" });
  const [game, setGame] = useState(null);
  const [lastTurn, setLastTurn] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [topics, setTopics] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showConfig, setShowConfig] = useState(true); // Default open on desktop, controlled by effect on mobile? responsive logic handled in render

  useEffect(() => {
    // Initial data load
    (async () => {
      try {
        const [gData, tData] = await Promise.all([
          getGroupsAPI(),
          getTopicsAPI(),
        ]);
        setGroups(gData);
        setTopics(tData);
      } catch (err) {
        setError(err.message || "Không tải được dữ liệu");
      }
    })();

    // Responsive config visibility
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setShowConfig(false);
      } else {
        setShowConfig(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStart = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const data = await startGameAPI(form);
      setGame(data.game);
      setLastTurn(null);
      setIsFlipped(false);
    } catch (err) {
      setError(err.message || "Khởi tạo game thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (!game?._id) return;
    try {
      setLoading(true);
      setError("");
      const data = await nextTurnAPI(game._id);
      setIsFlipped(false);
      setLastTurn(data);
      setGame((prev) => ({ ...prev, status: data.status }));
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Lỗi lượt chơi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Header Mobile */}
      <div className="lg:col-span-12 flex justify-between items-center mb-4">
        <h2 className="text-3xl font-black text-white tracking-tight">Game Session</h2>
        {error && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-sm font-medium">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>

      {/* Sidebar Controls - Mobile Collapsible */}
      <div className="lg:col-span-4 space-y-6">
        <div className="lg:hidden flex items-center justify-between bg-slate-900/50 p-4 rounded-2xl border border-white/10" onClick={() => setShowConfig(!showConfig)}>
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-accent-primary" />
            <h3 className="font-bold text-white uppercase tracking-wider text-sm">Cấu hình Game</h3>
          </div>
          <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${showConfig ? "rotate-90" : ""}`} />
        </div>

        <AnimatePresence>
          {(showConfig || window.innerWidth >= 1024) && (
            <motion.section
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} // Only exit on mobile when toggled
              className="glass-card p-6 overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-6 hidden lg:flex">
                <Settings className="w-5 h-5 text-accent-primary" />
                <h3 className="font-bold text-white uppercase tracking-wider text-sm">Cấu hình</h3>
              </div>

              <form onSubmit={handleStart} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase px-1">Nhóm chơi</label>
                  <select
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:ring-2 focus:ring-accent-primary outline-none transition-all appearance-none"
                    value={form.groupId}
                    onChange={(e) => setForm({ ...form, groupId: e.target.value })}
                    required
                  >
                    <option value="">Chọn group</option>
                    {groups.map((g) => <option key={g._id} value={g._id}>{g.groupName}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase px-1">Chủ đề</label>
                  <select
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:ring-2 focus:ring-accent-primary outline-none transition-all appearance-none"
                    value={form.topicId}
                    onChange={(e) => setForm({ ...form, topicId: e.target.value })}
                    required
                  >
                    <option value="all">Tất cả chủ đề</option>
                    {topics.map((t) => <option key={t._id} value={t._id}>{t.topicName}</option>)}
                  </select>
                </div>

                <button
                  className="btn-premium w-full flex items-center justify-center gap-2"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                  {loading ? "Đang khởi tạo..." : "Bắt đầu Game"}
                </button>
              </form>
            </motion.section>
          )}
        </AnimatePresence>

        {game && (
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 border-l-4 border-l-emerald-500 hidden lg:block"
          >
            <div className="flex items-center gap-3 mb-4 text-emerald-400">
              <Info className="w-5 h-5" />
              <h4 className="font-bold uppercase tracking-wider text-xs">Thông tin phiên</h4>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center text-slate-400">
                <span>Trạng thái:</span>
                <span className="capitalize text-emerald-400 font-bold">{game.status}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Nhóm:</span>
                <span className="text-white font-medium">{game.group}</span>
              </div>
            </div>
          </motion.section>
        )}
      </div>

      {/* Main Game Stage */}
      <div className="lg:col-span-8 h-full min-h-[600px]">
        <div className="glass-card h-full p-8 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Subtle Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-secondary/5 blur-[100px] rounded-full pointer-events-none" />

          {lastTurn ? (
            <div className="w-full max-w-md perspective-1000">
              <motion.div
                key={lastTurn.gameId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full h-[500px]"
                onClick={() => !isFlipped && !loading && setIsFlipped(true)}
              >
                <motion.div
                  className="w-full h-full relative preserve-3d transition-transform duration-700 shadow-2xl rounded-3xl cursor-pointer"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                >
                  {/* FRONT SIDE (User Info) */}
                  <div className="absolute inset-0 backface-hidden bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center space-y-6">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-accent-primary to-accent-secondary blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                      {lastTurn.player?.avtUrl ? (
                        <img
                          src={lastTurn.player.avtUrl}
                          alt={lastTurn.player.name}
                          className="relative w-40 h-40 rounded-full object-cover border-4 border-slate-800 shadow-xl"
                        />
                      ) : (
                        <div className="relative w-40 h-40 rounded-full bg-slate-800 flex items-center justify-center border-4 border-slate-700">
                          <UserIcon className="w-16 h-16 text-slate-600" />
                        </div>
                      )}
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent-primary rounded-full flex items-center justify-center border-4 border-slate-900 shadow-lg">
                        <Trophy className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="text-center space-y-2">
                      <h3 className="text-3xl font-black text-white tracking-tight">{lastTurn.player?.name || "Người chơi"}</h3>
                      <p className="text-slate-500 font-medium">Đến lượt bạn chia sẻ!</p>
                    </div>

                    {!isFlipped && (
                      <motion.div
                        animate={{ y: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="bg-white/5 px-4 py-2 rounded-full text-xs font-bold text-slate-400 backdrop-blur-sm border border-white/10"
                      >
                        Chạm để lật thẻ
                      </motion.div>
                    )}
                  </div>

                  {/* BACK SIDE (Question) */}
                  <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-indigo-900 to-slate-950 border border-white/10 rounded-3xl p-8 flex flex-col rotate-y-180">
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">
                        <HelpCircle className="w-4 h-4 text-indigo-400" />
                        <span className="text-[10px] font-black uppercase text-white/50 tracking-widest">Câu hỏi</span>
                      </div>
                      <div className="px-3 py-1.5 bg-accent-primary/20 text-accent-primary text-[10px] font-black rounded-lg border border-accent-primary/20 uppercase tracking-widest">
                        {lastTurn.question?.topic?.topicName || "Chung"}
                      </div>
                    </div>

                    <div className="flex-grow flex items-center justify-center">
                      <p className="text-2xl md:text-3xl font-bold text-white text-center leading-tight tracking-tight">
                        "{lastTurn.question?.content}"
                      </p>
                    </div>

                    <div className="mt-8 space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                          <span>Tiến độ</span>
                          <span>Còn {lastTurn.remainingQuestionCount} câu</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (lastTurn.remainingQuestionCount / 20) * 100)}%` }}
                            className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary"
                          />
                        </div>
                      </div>

                      <button
                        className="w-full h-14 bg-white text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                        disabled={loading}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext();
                        }}
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Tiếp tục <ChevronRight className="w-4 h-4" /></>}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-8 max-w-sm"
            >
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-accent-primary blur-[40px] opacity-20" />
                <div className="relative w-24 h-24 bg-slate-900 rounded-3xl border border-slate-800 flex items-center justify-center shadow-2xl">
                  <Gamepad2 className="w-12 h-12 text-accent-primary" />
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-3xl font-black text-white">Sẵn sàng kết nối?</h4>
                <p className="text-slate-500 font-medium px-4">
                  Chọn cấu hình bên trái và bắt đầu lượt chia sẻ đầu tiên của bạn.
                </p>
              </div>
              <button
                className="btn-premium px-12 py-4 shadow-2xl shadow-accent-primary/20 flex items-center gap-3 mx-auto"
                disabled={!game || loading}
                onClick={handleNext}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                Bắt đầu ngay
              </button>
            </motion.div>
          )}
        </div>
      </div>

    </div>
  );
};

export default GamePage;
