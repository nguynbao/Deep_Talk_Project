import { useEffect, useState } from "react";
import {
  createGroupAPI,
  getGroupsAPI,
  deleteGroupAPI,
  addUserToGroupAPI,
  removeUserFromGroupAPI,
} from "../app/api";
import { getUsersAPI } from "../app/api";

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

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await addUserToGroupAPI(memberForm.groupId, memberForm.userId);
      loadGroups();
    } catch (err) {
      setError(err.message || "Thêm user vào group thất bại");
    }
  };

  const handleRemove = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await removeUserFromGroupAPI(memberForm.groupId, memberForm.userId);
      loadGroups();
    } catch (err) {
      setError(err.message || "Xóa user khỏi group thất bại");
    }
  };

  return (
    <div className="row g-4">
      <div className="col-12 d-flex justify-content-between align-items-center">
        <h2 className="fw-bold text-white">Groups</h2>
        {error && <span className="badge text-bg-warning">{error}</span>}
      </div>

      <div className="col-lg-4 bg-transparent">
        <div className="card shadow-sm border-0 lift">
          <div className="card-body">
            <h5 className="card-title fw-semibold mb-3">Tạo group</h5>
            <form className="vstack gap-3" onSubmit={handleCreate}>
              <div>
                <label className="form-label">Tên nhóm</label>
                <input
                  className="form-control"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                />
              </div>
              <button className="btn btn-success w-100" type="submit">
                Tạo group
              </button>
            </form>
          </div>
        </div>
        <div className="card shadow-sm border-0 lift mt-4">
          <div className="card-body">
            <h6 className="card-title fw-semibold mb-3">Thêm / Xóa user</h6>
            <form className="vstack gap-3" onSubmit={handleAdd}>
              <div>
                <label className="form-label">Group</label>
                <select
                  className="form-select"
                  value={memberForm.groupId}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, groupId: e.target.value })
                  }
                  required
                >
                  <option value="">Chọn group</option>
                  {groups.map((g) => (
                    <option key={g._id} value={g._id}>
                      {g.groupName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">User</label>
                <select
                  className="form-select"
                  value={memberForm.userId}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, userId: e.target.value })
                  }
                  required
                >
                  <option value="">Chọn user</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-primary flex-grow-1" type="submit">
                  Thêm user
                </button>
                <button
                  className="btn btn-outline-danger"
                  type="button"
                  onClick={handleRemove}
                >
                  Xóa
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="col-lg-8 bg-transparent">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="card-title fw-semibold mb-0">Danh sách</h5>
              {loading && <span className="text-muted small">Loading...</span>}
            </div>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Tên</th>
                    <th>Members</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((group) => (
                    <tr key={group._id}>
                      <td className="fw-semibold">{group.groupName}</td>
                      <td className="text-muted small">
                        {group.members && group.members.length
                          ? group.members.map((m) => m.name).join(", ")
                          : "No members"}
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(group._id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!groups.length && (
                    <tr>
                      <td colSpan={3} className="text-center text-muted">
                        Chưa có group nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupsPage;
