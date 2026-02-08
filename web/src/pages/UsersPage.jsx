import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Users, Trash2, Link as LinkIcon, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { createUserAPI, getUsersAPI, deleteUserAPI } from "../app/api";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", avtUrl: "" });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsersAPI();
      setUsers(data);
    } catch (err) {
      setError(err.message || "Không tải được users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await createUserAPI({ name: form.name, avtUrl: form.avtUrl });
      setForm({ name: "", avtUrl: "" });
      loadUsers();
    } catch (err) {
      setError(err.message || "Tạo user thất bại");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUserAPI(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      setError(err.message || "Xóa user thất bại");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Users className="w-10 h-10 text-accent-primary" />
            Users Management
          </h2>
          <p className="text-slate-400 font-medium">Quản lý và thiết lập hồ sơ người tham gia.</p>
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
        {/* Creation Sidebar */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 glass-card p-8 space-y-8 sticky top-28"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-accent-primary" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Thêm Thành Viên</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Tên hiển thị</label>
              <div className="relative group">
                <input
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-accent-primary outline-none transition-all"
                  placeholder="Nhập tên người chơi..."
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Avatar URL</label>
              <div className="relative group">
                <input
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 ps-11 text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-accent-primary outline-none transition-all"
                  placeholder="https://example.com/avatar.jpg"
                  value={form.avtUrl}
                  onChange={(e) => setForm({ ...form, avtUrl: e.target.value })}
                />
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-accent-primary" />
              </div>
              <p className="text-[10px] text-slate-500 font-medium italic mt-1 px-1">Dán link ảnh để profile thêm nổi bật.</p>
            </div>

            <button className="btn-premium w-full shadow-lg shadow-accent-primary/20" type="submit">
              Lưu Người Chơi
            </button>
          </form>
        </motion.section>

        {/* List Content */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-dark-border flex justify-between items-center bg-white/5">
              <h4 className="font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Danh Sách Người Chơi
              </h4>
              <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest border border-white/5">
                {users.length} thành viên
              </span>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Người chơi</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border">
                  <AnimatePresence mode="popLayout">
                    {loading ? (
                      <tr>
                        <td colSpan={2} className="px-6 py-12 text-center">
                          <Loader2 className="w-8 h-8 animate-spin text-accent-primary mx-auto mb-2" />
                          <p className="text-slate-500 font-medium">Đang tải danh sách...</p>
                        </td>
                      </tr>
                    ) : users.length > 0 ? (
                      users.map((user) => (
                        <motion.tr
                          key={user._id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="group hover:bg-white/5 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                {user.avtUrl ? (
                                  <img
                                    src={user.avtUrl}
                                    alt={user.name}
                                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-800 group-hover:ring-accent-primary/50 transition-all"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-slate-500 font-black text-lg ring-2 ring-slate-800 group-hover:ring-accent-primary/50 transition-all">
                                    {user.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-dark-card rounded-full" />
                              </div>
                              <div>
                                <h5 className="font-bold text-white tracking-tight">{user.name}</h5>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ID: {user._id.slice(-6)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                              onClick={() => handleDelete(user._id)}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-6 py-20 text-center">
                          <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-800">
                            <Users className="w-8 h-8 text-slate-700" />
                          </div>
                          <p className="text-slate-500 font-medium">Chưa có thành viên nào được tạo.</p>
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
                {users.map((user) => (
                  <motion.div
                    key={user._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {user.avtUrl ? (
                          <img src={user.avtUrl} alt={user.name} className="w-10 h-10 rounded-xl object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-slate-500">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <h5 className="font-bold text-white text-sm">{user.name}</h5>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">{user._id.slice(-6)}</p>
                      </div>
                    </div>
                    <button
                      className="p-2 text-slate-600 hover:text-red-400 bg-slate-800/50 rounded-lg"
                      onClick={() => handleDelete(user._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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

export default UsersPage;
