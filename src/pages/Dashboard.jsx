import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import './dashboard.css'

export default function Dashboard({currentUser, setCurrentUser}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchTerm , setSearchTerm] = useState("")
  const navigate = useNavigate(); 

  const handleSearchSubmit = () => {
    const trimmed = searchTerm.trim();
    const taskIdPattern = /^task-\d+$/i;

    if(taskIdPattern.test(trimmed)){
      navigate(`/task/${trimmed}?expanded=true`);
      setSearchTerm("");
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  return (
    <div className="dashboard">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}/>
        <div className="dashnoard-main">
            <Navbar 
              toggleSidebar={toggleSidebar} 
              searchTerm={searchTerm}   
              setSearchTerm={setSearchTerm}
              onSearchSubmit={handleSearchSubmit}
            />
            <main className="dashboard-content">
                <Outlet context={{currentUser, setCurrentUser, searchTerm}}/>

            {!currentUser && (
              <div className="content-logged-out-overlay">
                <div className="logged-out-card">
                  <h2>Please log in to continue</h2>
                  <p>You need to be signed in to view and manage tasks</p>
                  <div className="logged-out-actions">
                    <Link to="/login" className="logged-out-btn primary">
                      Login
                    </Link>
                    <Link to="/sign-up" className="logged-out-btn secondary">
                      Sign up
                    </Link>
                  </div>
                </div>
              </div>
            )}
            </main>
        </div>
    </div>
  )
}