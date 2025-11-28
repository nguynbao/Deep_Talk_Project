import { Link } from "react-router-dom";

const Home = () => {
  const cards = [
    {
      title: "Users",
      text: "Tạo và quản lý người chơi, thêm avatar để profile nổi bật.",
      to: "/users",
      color: "bg-gradient-primary",
    },
    {
      title: "Groups",
      text: "Tạo phòng, thêm bạn bè vào nhóm để chơi cùng nhau.",
      to: "/groups",
      color: "bg-gradient-success",
    },
    {
      title: "Questions",
      text: "Soạn câu hỏi theo chủ đề để cuộc trò chuyện thú vị hơn.",
      to: "/questions",
      color: "bg-gradient-warning",
    },
    {
      title: "Games",
      text: "Bắt đầu game, chọn chủ đề hoặc chơi tất cả, random lượt công bằng.",
      to: "/games",
      color: "bg-gradient-info",
    },
  ];

  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="hero-card p-4 p-md-5 text-white rounded-4">
          <h1 className="fw-bold display-5 mb-3">DeepTalk Playground</h1>
          <p className="lead mb-4">
            Tone màu trẻ trung, thao tác nhanh: quản lý user, group, câu hỏi và
            khởi động game trong vài cú click.
          </p>
          <div className="d-flex gap-3 flex-wrap">
            <Link className="btn btn-light btn-lg px-4" to="/games">
              Bắt đầu chơi
            </Link>
            <Link className="btn btn-outline-light btn-lg px-4" to="/questions">
              Soạn câu hỏi
            </Link>
          </div>
        </div>
      </div>
      {cards.map((card) => (
        <div className="col-md-6 col-lg-3" key={card.title}>
          <div className={`card lift ${card.color} text-white h-100`}>
            <div className="card-body d-flex flex-column">
              <h5 className="card-title fw-bold">{card.title}</h5>
              <p className="card-text flex-grow-1">{card.text}</p>
              <Link className="btn btn-light mt-2" to={card.to}>
                Đi tới {card.title}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
