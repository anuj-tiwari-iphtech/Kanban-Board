import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import { useState } from "react";
import useLocalStorage from "../customHooks/useLocalStorage";
import './dashboard.css'

export default function Dashboard({currentUser, setCurrentUser}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  return (
    <div className="dashboard">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}/>
        <div className="dashnoard-main">
            <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} toggleSidebar={toggleSidebar}/>
            <main className="dashboard-content">
                <Outlet context={{currentUser, setCurrentUser}}/>
            </main>
        </div>
    </div>
  )
}