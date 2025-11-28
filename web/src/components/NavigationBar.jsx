import { NavLink } from "react-router-dom";

const NavigationBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark glassy-nav sticky-top">
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/">
          DeepTalk
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto gap-2">
            <li className="nav-item">
              <NavLink className="nav-link" to="/users">
                Users
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/groups">
                Groups
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/questions">
                Questions
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/games">
                Games
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
