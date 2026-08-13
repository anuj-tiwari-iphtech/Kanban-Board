import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import './dashboard.css'

export default function Dashboard() {
  return (
    <div className="dashboard">
        <Sidebar/>
        <div className="dashnoard-main">
            <Navbar/>
            <main className="dashboard-content">
                <Outlet/>
            </main>
        </div>
    </div>
  )
}