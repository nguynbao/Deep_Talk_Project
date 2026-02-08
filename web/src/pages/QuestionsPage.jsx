import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, MessageSquarePlus, Trash2, Tag, Loader2, AlertCircle, Search, Filter } from "lucide-react";
import { createQuestionAPI, getQuestionsAPI, deleteQuestionAPI, getQuestionsByTopicAPI, getTopicsAPI } from "../app/api";

const QuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ content: "", topic: "" });
  const [selectedTopic, setSelectedTopic] = useState("all");

  const loadQuestions = async (topicFilter = selectedTopic) => {
    try {
      setLoading(true);
      setError("");
      let data;
      if (!topicFilter || topicFilter === "all") {
        data = await getQuestionsAPI();
      } else {
        data = await getQuestionsByTopicAPI({ topicId: topicFilter });
      }
      setQuestions(data);
    } catch (err) {
      setError(err.message || "Không tải được câu hỏi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const topicData = await getTopicsAPI();
        setTopics(topicData);
      } catch (err) {
        setError(err.message || "Không tải được topics");
      }
    })();
  }, []);

  useEffect(() => {
    loadQuestions(selectedTopic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTopic]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await createQuestionAPI(form);
      setForm({ content: "", topic: "" });
      loadQuestions(selectedTopic);
    } catch (err) {
      setError(err.message || "Tạo câu hỏi thất bại");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteQuestionAPI(id);
      setQuestions((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      setError(err.message || "Xóa câu hỏi thất bại");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <HelpCircle className="w-10 h-10 text-accent-primary" />
            Questions Pool
          </h2>
          <p className="text-slate-400 font-medium">Kho lưu trữ các chủ đề thảo luận sâu sắc.</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-sm font-medium"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Creation */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 glass-card p-8 space-y-8 sticky top-28"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center">
              <MessageSquarePlus className="w-5 h-5 text-accent-primary" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Soạn Câu Hỏi</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Nội dung thảo luận</label>
              <textarea
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-accent-primary outline-none transition-all resize-none"
                rows={5}
                placeholder="Câu hỏi này sẽ giúp mọi người kết nối hơn..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Gắn chủ đề</label>
              <div className="relative group">
                <select
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 ps-11 text-slate-200 outline-none focus:ring-2 focus:ring-accent-primary appearance-none transition-all"
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                >
                  <option value="">(Chung)</option>
                  {topics.map((t) => <option key={t._id} value={t._id}>{t.topicName}</option>)}
                </select>
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-accent-primary" />
              </div>
            </div>

            <button className="btn-premium w-full shadow-lg shadow-accent-primary/20 mt-4" type="submit">
              Lưu Câu Hỏi
            </button>
          </form>
        </motion.section>

        {/* List Content */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-dark-border flex flex-col sm:flex-row justify-between items-center bg-white/5 gap-4">
              <div className="flex items-center gap-3">
                <h4 className="font-bold text-white">Thư Viện Câu Hỏi</h4>
                {loading && <Loader2 className="w-4 h-4 animate-spin text-accent-primary" />}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-grow">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select
                    className="w-full sm:w-auto bg-slate-900/50 border border-slate-800 rounded-lg py-2 ps-9 pe-4 text-xs font-bold text-slate-400 focus:ring-1 focus:ring-accent-primary outline-none appearance-none"
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                  >
                    <option value="all">Tất cả topic</option>
                    {topics.map((t) => <option key={t._id} value={t._id}>{t.topicName}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest w-[70%]">Nội dung</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Chủ đề</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border">
                  <AnimatePresence mode="popLayout">
                    {questions.length > 0 ? (
                      questions.map((question) => (
                        <motion.tr
                          key={question._id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="group hover:bg-white/5 transition-colors"
                        >
                          <td className="px-6 py-5 text-slate-300 font-medium leading-relaxed">
                            {question.content}
                          </td>
                          <td className="px-6 py-5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-primary/10 text-accent-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-accent-primary/20">
                              <Tag className="w-3 h-3" />
                              {question.topic?.topicName || question.topic || "Chung"}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button
                              className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                              onClick={() => handleDelete(question._id)}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    ) : !loading && (
                      <tr>
                        <td colSpan={3} className="px-6 py-20 text-center">
                          <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-800">
                            <Search className="w-8 h-8 text-slate-700" />
                          </div>
                          <p className="text-slate-500 font-medium italic">Không tìm thấy câu hỏi nào.</p>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden p-4 space-y-4">
              <AnimatePresence mode="popLayout">
                {questions.map((question) => (
                  <motion.div
                    key={question._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 space-y-4"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <p className="text-slate-200 font-medium text-sm leading-relaxed line-clamp-3">
                        {question.content}
                      </p>
                      <button
                        className="p-2 text-slate-600 hover:text-red-400 bg-slate-800/50 rounded-lg shrink-0"
                        onClick={() => handleDelete(question._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center pt-2 border-t border-white/5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent-primary/10 text-accent-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-accent-primary/20">
                        <Tag className="w-3 h-3" />
                        {question.topic?.topicName || question.topic || "Chung"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;
