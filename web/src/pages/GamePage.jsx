import { useEffect, useState } from "react";
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
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
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
      setIsFading(false);
    } catch (err) {
      setError(err.message || "Khởi tạo game thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (!game?._id) return;
    try {
      // Làm mờ câu hỏi trước
      setIsFading(true);
      
      // Đợi animation fade hoàn thành
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Load câu hỏi mới
      setLoading(true);
      setError("");
      const data = await nextTurnAPI(game._id);
      
      // Úp thẻ lại và cập nhật data
      setIsFlipped(false);
      setIsFading(false);
      setLastTurn(data);
      setGame((prev) => ({ ...prev, status: data.status }));
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Lỗi lượt chơi");
      setIsFading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    if (lastTurn && !isFlipped && !loading) {
      setIsFlipped(true);
    }
  };

  return (
    <div className="row g-4">
      <div className="col-12 d-flex justify-content-between align-items-center">
        <h2 className="fw-bold text-white">Game</h2>
        {error && <span className="badge text-bg-warning">{error}</span>}
      </div>

      <div className="col-lg-4">
        <div className="card shadow-sm border-0 lift bg-dark bg-opacity-50">
          <div className="card-body">
            <h5 className="card-title fw-semibold mb-3 text-white">Bắt đầu game</h5>
            <form className="vstack gap-3" onSubmit={handleStart}>
              <div>
                <label className="form-label text-white-50">Group</label>
                <select
                  className="form-select bg-dark bg-opacity-50 text-white border-secondary"
                  value={form.groupId}
                  onChange={(e) =>
                    setForm({ ...form, groupId: e.target.value })
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
                <label className="form-label text-white-50">Topic</label>
                <select
                  className="form-select bg-dark bg-opacity-50 text-white border-secondary"
                  value={form.topicId}
                  onChange={(e) =>
                    setForm({ ...form, topicId: e.target.value })
                  }
                  required
                >
                  <option value="all">All topics</option>
                  {topics.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.topicName}
                    </option>
                  ))}
                </select>
              </div>
              <button className="btn btn-info w-100" type="submit" disabled={loading}>
                {loading ? "Đang khởi tạo..." : "Start game"}
              </button>
            </form>
          </div>
        </div>
        {game && (
          <div className="card shadow-sm border-0 mt-3 bg-dark bg-opacity-50">
            <div className="card-body">
              <h6 className="fw-semibold mb-2 text-white">Trạng thái game</h6>
              <p className="mb-1 small text-white">ID: {game._id}</p>
              <p className="mb-1 small text-white">
                Group: {game.group} 
              </p>
              <p className="mb-1 small text-white">
                Topic: {game.topic || "all"}
              </p>
              <span className={`badge text-uppercase ${game.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                {game.status}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="col-lg-8">
        <div className="card shadow-sm border-0 h-100 bg-dark bg-opacity-50">
          <div className="card-body d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="card-title fw-semibold mb-0 text-white">Lượt chơi</h5>
              {loading && <span className="text-muted small">Loading...</span>}
            </div>
            
            <div className="flex-grow-1 d-flex align-items-center justify-content-center">
              {lastTurn ? (
                <div className="flashcard-container">
                  <div 
                    className={`flashcard ${isFlipped ? 'flipped' : ''}`}
                    onClick={handleCardClick}
                    style={{ cursor: isFlipped ? 'default' : 'pointer' }}
                  >
                    {/* Mặt trước - User Info */}
                    <div className="flashcard-front">
                      <div className="d-flex flex-column align-items-center justify-content-center h-100 p-4 text-white position-relative">
                        <div className="mb-4">
                          {lastTurn.player?.avtUrl ? (
                            <img 
                              src={lastTurn.player.avtUrl} 
                              alt={lastTurn.player.name}
                              className="rounded-circle border border-light border-3"
                              style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="rounded-circle border border-light border-3 d-flex align-items-center justify-content-center bg-light bg-opacity-25" 
                                 style={{ width: '120px', height: '120px' }}>
                              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                            </div>
                          )}
                        </div>
                        <h3 className="fw-bold mb-3">{lastTurn.player?.name || "Unknown"}</h3>
                        {!isFlipped && (
                          <p className="text-white-50 mb-0">Nhấn để xem câu hỏi</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Mặt sau - Question */}
                    <div className="flashcard-back">
                      <div className={`d-flex flex-column h-100 p-4 text-white ${isFading ? 'opacity-50' : ''}`}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="text-uppercase small fw-bold text-white-50">Câu hỏi</span>
                          <span className="badge bg-light bg-opacity-25 text-white">
                            {lastTurn.question?.topic?.topicName ||
                              lastTurn.question?.topic ||
                              "N/A"}
                          </span>
                        </div>
                        <p className="fs-4 fw-semibold flex-grow-1 d-flex align-items-center justify-content-center text-center mb-3">
                          {lastTurn.question?.content}
                        </p>
                        <div className="d-flex justify-content-center mb-3">
                          <span className="badge bg-light bg-opacity-25 text-white px-3 py-2">
                            Còn lại: {lastTurn.remainingQuestionCount} câu
                          </span>
                        </div>
                        <button
                          className="btn btn-primary w-100 btn-lg"
                          disabled={loading}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                          }}
                        >
                          {loading ? "Đang tải..." : "Next"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="display-4 mb-3">🎮</div>
                  <p className="text-white">Chưa có lượt nào. Bắt đầu game rồi nhấn Next.</p>
                  <button
                    className="btn btn-primary btn-lg mt-3"
                    disabled={!game || loading}
                    onClick={handleNext}
                  >
                    {loading ? "Đang tải..." : "Next"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
