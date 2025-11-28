import { useEffect, useState } from "react";
import {
  createQuestionAPI,
  getQuestionsAPI,
  deleteQuestionAPI,
} from "../app/api";
import { getTopicsAPI } from "../app/api";

const QuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ content: "", topic: "" });

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await getQuestionsAPI();
      setQuestions(data);
    } catch (err) {
      setError(err.message || "Không tải được câu hỏi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
    (async () => {
      try {
        const topicData = await getTopicsAPI();
        setTopics(topicData);
      } catch (err) {
        setError(err.message || "Không tải được topics");
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await createQuestionAPI(form);
      setForm({ content: "", topic: "" });
      loadQuestions();
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
    <div className="row g-4">
      <div className="col-12 d-flex justify-content-between align-items-center">
        <h2 className="fw-bold text-white">Questions</h2>
        {error && <span className="badge text-bg-warning">{error}</span>}
      </div>

      <div className="col-lg-4">
        <div className="card shadow-sm border-0 lift">
          <div className="card-body">
            <h5 className="card-title fw-semibold mb-3">Soạn câu hỏi</h5>
            <form className="vstack gap-3" onSubmit={handleSubmit}>
              <div>
                <label className="form-label">Nội dung</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="form-label">Topic</label>
                <select
                  className="form-select"
                  value={form.topic}
                  onChange={(e) =>
                    setForm({ ...form, topic: e.target.value })
                  }
                >
                  <option value="">(Không chọn)</option>
                  {topics.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.topicName}
                    </option>
                  ))}
                </select>
              </div>
              <button className="btn btn-warning w-100" type="submit">
                Lưu câu hỏi
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
                    <th>Nội dung</th>
                    <th>Topic</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question) => (
                    <tr key={question._id}>
                      <td>{question.content}</td>
                      <td className="text-muted small">
                        {question.topic?.topicName || question.topic || "N/A"}
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(question._id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!questions.length && (
                    <tr>
                      <td colSpan={3} className="text-center text-muted">
                        Chưa có câu hỏi nào.
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

export default QuestionsPage;
