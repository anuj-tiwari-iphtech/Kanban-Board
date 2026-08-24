import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import { useState } from "react";
import './dashboard.css'

export default function Dashboard({currentUser, setCurrentUser}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchTerm , setSearchTerm] = useState("")
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  return (
    <div className="dashboard">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}/>
        <div className="dashnoard-main">
            <Navbar 
              currentUser={currentUser} 
              setCurrentUser={setCurrentUser} 
              toggleSidebar={toggleSidebar} 
              searchTerm={searchTerm}   
              setSearchTerm={setSearchTerm}
            />
            <main className="dashboard-content">
                <Outlet context={{currentUser, setCurrentUser, searchTerm}}/>
            </main>
        </div>
    </div>
  )
}