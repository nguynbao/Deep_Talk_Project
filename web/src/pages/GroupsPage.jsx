import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderPlus, Users, Trash2, UserPlus, UserMinus, ChevronRight, Loader2, AlertCircle, LayoutGrid } from "lucide-react";
import { createGroupAPI, getGroupsAPI, deleteGroupAPI, addUserToGroupAPI, removeUserFromGroupAPI, getUsersAPI } from "../app/api";

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [groupName, setGroupName] = useState("");
  const [memberForm, setMemberForm] = useState({ groupId: "", userId: "" });

  const loadGroups = async () => {
    try {
      setLoading(true);
      const data = await getGroupsAPI();
      setGroups(data);
    } catch (err) {
      setError(err.message || "Không tải được groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
    (async () => {
      try {
        const usersData = await getUsersAPI();
        setUsers(usersData);
      } catch (err) {
        setError(err.message || "Không tải được users");
      }
    })();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await createGroupAPI(groupName);
      setGroupName("");
      loadGroups();
    } catch (err) {
      setError(err.message || "Tạo group thất bại");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteGroupAPI(id);
      setGroups((prev) => prev.filter((g) => g._id !== id));
    } catch (err) {
      setError(err.message || "Xóa group thất bại");
    }
  };

  const handleMemberAction = async (action) => {
    if (!memberForm.groupId || !memberForm.userId) return;
    try {
      setError("");
      if (action === "add") {
        await addUserToGroupAPI(memberForm.groupId, memberForm.userId);
      } else {
        await removeUserFromGroupAPI(memberForm.groupId, memberForm.userId);
      }
      loadGroups();
    } catch (err) {
      setError(err.message || "Thao tác thành viên thất bại");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <LayoutGrid className="w-10 h-10 text-accent-primary" />
            Groups Management
          </h2>
          <p className="text-slate-400 font-medium">Xây dựng và quản lý các nhóm người chơi.</p>
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
        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-6 sticky top-28">
          {/* Create Group */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <FolderPlus className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-bold text-white uppercase tracking-wider text-xs">Tạo Nhóm Mới</h3>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="VD: Hội Bạn Thân..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
              <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20" type="submit">
                Tạo Nhóm
              </button>
            </form>
          </motion.section>

          {/* Member Management */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent-primary" />
              </div>
              <h3 className="font-bold text-white uppercase tracking-wider text-xs">Quản Lý Thành Viên</h3>
            </div>
            <div className="space-y-4">
              <select
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-accent-primary appearance-none"
                value={memberForm.groupId}
                onChange={(e) => setMemberForm({ ...memberForm, groupId: e.target.value })}
                required
              >
                <option value="">Chọn Nhóm...</option>
                {groups.map((g) => <option key={g._id} value={g._id}>{g.groupName}</option>)}
              </select>

              <select
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-accent-primary appearance-none"
                value={memberForm.userId}
                onChange={(e) => setMemberForm({ ...memberForm, userId: e.target.value })}
                required
              >
                <option value="">Chọn Người Chơi...</option>
                {users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleMemberAction("add")}
                  className="flex items-center justify-center gap-2 py-3 bg-accent-primary hover:bg-indigo-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/20"
                >
                  <UserPlus className="w-4 h-4" /> Ghi danh
                </button>
                <button
                  onClick={() => handleMemberAction("remove")}
                  className="flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-xl font-bold text-sm transition-all border border-slate-700 hover:border-red-500/30"
                >
                  <UserMinus className="w-4 h-4" /> Gỡ
                </button>
              </div>
            </div>
          </motion.section>
        </div>

        {/* List Content */}
        <div className="lg:col-span-8 space-y-6 text-white">
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-dark-border flex justify-between items-center bg-white/5">
              <h4 className="font-bold flex items-center gap-2 text-slate-300">
                <ChevronRight className="w-4 h-4 text-accent-primary" />
                Danh Sách Nhóm Đang Hoạt Động
              </h4>
              <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest border border-white/5">
                {groups.length} groups
              </span>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Tên Nhóm</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Thành viên</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border">
                  <AnimatePresence mode="popLayout">
                    {loading ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center">
                          <Loader2 className="w-8 h-8 animate-spin text-accent-primary mx-auto mb-2" />
                          <p className="text-slate-500 font-medium">Đang cập nhật...</p>
                        </td>
                      </tr>
                    ) : groups.length > 0 ? (
                      groups.map((group) => (
                        <motion.tr
                          key={group._id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="group hover:bg-white/5 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <h5 className="font-bold text-white tracking-tight">{group.groupName}</h5>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ID: {group._id.slice(-6)}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1.5">
                              {group.members && group.members.length > 0 ? (
                                group.members.map((m) => (
                                  <span key={m._id} className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-medium rounded-md border border-slate-700/50">
                                    {m.name}
                                  </span>
                                ))
                              ) : (
                                <span className="text-slate-600 text-[10px] font-medium italic">Trống</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                              onClick={() => handleDelete(group._id)}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-20 text-center">
                          <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-800">
                            <LayoutGrid className="w-8 h-8 text-slate-700" />
                          </div>
                          <p className="text-slate-500 font-medium">Chưa có nhóm nào được tạo.</p>
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
                {groups.map((group) => (
                  <motion.div
                    key={group._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-bold text-white text-sm">{group.groupName}</h5>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">ID: {group._id.slice(-6)}</p>
                      </div>
                      <button
                        className="p-2 text-slate-600 hover:text-red-400 bg-slate-800/50 rounded-lg"
                        onClick={() => handleDelete(group._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                      {group.members && group.members.length > 0 ? (
                        group.members.map((m) => (
                          <span key={m._id} className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-medium rounded-md border border-slate-700/50">
                            {m.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-600 text-[10px] font-medium italic">Chưa có thành viên</span>
                      )}
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

export default GroupsPage;
