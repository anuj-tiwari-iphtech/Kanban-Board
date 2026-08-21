import { useState } from "react";
import {
  HiHome,
  HiOutlineViewGrid,
  HiOutlineChartBar,
  HiOutlineChatAlt2,
  HiOutlineCog
} from "react-icons/hi";
import { NavLink } from "react-router-dom";

import "./sidebar.css";

export default function SidebarMenu1({active, setActive}) {
  // const [active, setActive] = useState("General");

  const menuItems = [
    { label: "General", icon: <HiHome />, path:"/" },
    { label: "Board", icon: <HiOutlineViewGrid />, path:"/board"},
    { label: "Report", icon: <HiOutlineChartBar />, path: "/report"},
    { label: "Inbox", icon: <HiOutlineChatAlt2 />, path:"/indox"},
    { label: "Settings", icon: <HiOutlineCog />, path:"/setting" }
  ];

  return (
    <>
    <div className="sidebar-menu">
      {menuItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.path}
          className={
            `menu-item indent ${active === item.label ? "selected" : ""}`
          }
          onClick={() => setActive(item.label)}
        >
          <span className="icon">{item.icon}</span>
          <span className="menu-label">{item.label}</span>
        </NavLink>
      ))}
    </div>
    
    </>
  );
}