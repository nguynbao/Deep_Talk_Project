import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Home from "./pages/Home";
import UsersPage from "./pages/UsersPage";
import GroupsPage from "./pages/GroupsPage";
import QuestionsPage from "./pages/QuestionsPage";
import GamePage from "./pages/GamePage";

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <NavigationBar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/questions" element={<QuestionsPage />} />
            <Route path="/games" element={<GamePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
