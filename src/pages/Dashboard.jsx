import { useMemo, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import useFirestoreCollection from "../Firebase/useFirestoreCollection";
import Login from "./Login";
import SignUp from "./Signup"; // Ensure filename case matches your setup
import "./dashboard.css";

export default function Dashboard({ currentUser, setCurrentUser }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const { data: tasks } = useFirestoreCollection("tasks", currentUser?.id, true);

  const matchingTasks = useMemo(() => {
    const trimmed = searchTerm.trim().toLowerCase();
    if (!trimmed || trimmed.length < 2) return [];

    return tasks
      .filter(
        (t) =>
          t.id?.toLowerCase().includes(trimmed) ||
          t.name?.toLowerCase().includes(trimmed)
      )
      .slice(0, 6);
  }, [searchTerm, tasks]);

  const handleSelectSuggestion = (task) => {
    navigate(`/task/${task.id}?expanded=true`);
    setSearchTerm("");
    setShowSuggestion(false);
  };

  const handleSearchSubmit = () => {
    const trimmed = searchTerm.trim();
    const taskIdPattern = /^task-\d+$/i;

    if (taskIdPattern.test(trimmed)) {
      navigate(`/task/${trimmed}?expanded=true`);
      setSearchTerm("");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Helper to render auth pages vs actual app pages
  const renderMainContent = () => {
    if (!currentUser) {
      if (location.pathname === "/sign-up") {
        return <SignUp />;
      }
      return <Login />;
    }
    return <Outlet context={{ currentUser, setCurrentUser, searchTerm }} />;
  };

  return (
    <div className="dashboard">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="dashboard-main">
        <Navbar
          toggleSidebar={toggleSidebar}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearchSubmit={handleSearchSubmit}
          matchingTasks={matchingTasks}
          showSuggestion={showSuggestion}
          setShowSuggestion={setShowSuggestion}
          onSelectSuggestion={handleSelectSuggestion}
        />
        
        <main className="dashboard-content">
          <div className="content-wrapper">
            {renderMainContent()}
          </div>
        </main>
      </div>
    </div>
  );
}