import { HiOutlineCheckCircle, HiOutlineBookmark,HiOutlineQuestionMarkCircle } from "react-icons/hi";
import { BsStopwatch } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import './sidebar.css'

export default function SidebarMenu2({active, setActive}) {
  const navigate = useNavigate()
    const items = [
        {label: "Published", icon: <HiOutlineCheckCircle/> , path :"/published"},
        {label: "Today's Scheduled", icon: <BsStopwatch/> , path : "/today-scheduleds"},
        {label: "Bookmark", icon: <HiOutlineBookmark/>, path : "/bookmark"},
        { label: "FAQ", icon: <HiOutlineQuestionMarkCircle />, path: "/faq" }
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
          onClick={() => {setActive(item.label); navigate(item.path)}}
        >
          <span className="icon">{item.icon}</span>
          <span className="menu-label">{item.label}</span>
        </div>
      ))}
    </div>
    </>
  )
}