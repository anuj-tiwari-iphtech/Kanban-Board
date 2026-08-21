import { useState } from "react"
import sidebar from "../../assets/sidebar.png"
import SidebarMenu1 from "./SidebarMenu1"
import SidebarMenu2 from "./SidebarMenu2"
import "./sidebar.css"

export default function Sidebar({ isOpen, onClose }) {
  const [active, setActive] = useState("General")
  return (
    <>
    {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
    <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header"> 
        <img src={sidebar} className="sidebar-img"/>
        <h2>Kanban Board</h2>
        </div>

        <SidebarMenu1 active={active} setActive={setActive}/>
        
        <hr className="sidebar-hr"/>
        <p className="sidebar-label">Label</p>
        <SidebarMenu2 active={active} setActive={setActive}/>
    </div>
    
    </>
  )
}