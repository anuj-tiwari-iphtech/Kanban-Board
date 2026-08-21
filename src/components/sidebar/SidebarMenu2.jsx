import { HiOutlineCheckCircle, HiOutlineBookmark } from "react-icons/hi";
import { BsStopwatch } from "react-icons/bs";
import { useState } from "react";
import './sidebar.css'

export default function SidebarMenu2({active, setActive}) {
    // const[active, setActive] = useState()
    const items = [
        {label: "Published", icon: <HiOutlineCheckCircle/>},
        {label: "Today's Scheduled", icon: <BsStopwatch/>},
        {label: "Bookmark", icon: <HiOutlineBookmark/>}
    ]
  return (
    <>
    <div className="sidebar-menu2">
      {items.map((item) => (
        <div
          key={item.label}
          className={`menu-item indent ${
            active === item.label ? "selected" : ""
          }`}
          onClick={() => setActive(item.label)}
        >
          <span className="icon">{item.icon}</span>
          <span className="menu-label">{item.label}</span>
        </div>
      ))}
    </div>
    </>
  )
}