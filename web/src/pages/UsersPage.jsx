import { useEffect, useState } from "react";
import {
  createUserAPI,
  getUsersAPI,
  deleteUserAPI,
} from "../app/api";

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
      await createUserAPI({
        name: form.name,
        avtUrl: form.avtUrl,
      });
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
    <div className="row g-4">
      <div className="col-12">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="fw-bold text-white">Users</h2>
          {error && <span className="badge text-bg-warning">{error}</span>}
        </div>
      </div>
      <div className="col-lg-4">
        <div className="card shadow-sm border-0 lift">
          <div className="card-body">
            <h5 className="card-title fw-semibold mb-3">Tạo user</h5>
            <form className="vstack gap-3" onSubmit={handleSubmit}>
              <div>
                <label className="form-label">Tên</label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="form-label">Avatar URL</label>
                <input
                  className="form-control"
                  value={form.avtUrl}
                  onChange={(e) => setForm({ ...form, avtUrl: e.target.value })}
                />
              </div>
              <button className="btn btn-primary w-100" type="submit">
                Tạo user
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="col-lg-8">
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
                    <th>Avatar</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>
                        {user.avtUrl ? (
                          <img
                            src={user.avtUrl}
                            alt={user.name}
                            className="avatar"
                          />
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(user._id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!users.length && (
                    <tr>
                      <td colSpan={4} className="text-center text-muted">
                        Chưa có user nào.
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

export default UsersPage;
