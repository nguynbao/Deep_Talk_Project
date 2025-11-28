import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Home from "./pages/Home";
import UsersPage from "./pages/UsersPage";
import GroupsPage from "./pages/GroupsPage";
import QuestionsPage from "./pages/QuestionsPage";
import GamePage from "./pages/GamePage";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <NavigationBar />
        <main className="container py-4">
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
    </BrowserRouter>
  );
}

export default App;
