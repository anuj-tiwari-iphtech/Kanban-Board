import sidebar from "../../assets/sidebar.png"
import SidebarMenu1 from "./SidebarMenu1"
import SidebarMenu2 from "./SidebarMenu2"
import "./sidebar.css"

export default function Sidebar() {
  return (
    <>
    <div className="sidebar-container">
        <div className="sidebar-header"> 
        <img src={sidebar} className="sidebar-img"/>
        <h2>Kanban Board</h2>
        </div>

        <SidebarMenu1/>
        
        <hr className="sidebar-hr"/>
        <p className="sidebar-label">Label</p>
        <SidebarMenu2/>
    </div>
    
    </>
  )
}