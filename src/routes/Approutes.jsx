import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import General from "../pages/General";
import Board from "../pages/Board";
import Report from "../pages/Report";
import Indox from "../pages/Indox";
import Setting from "../pages/Setting";
import Login from "../pages/Login";
import SignUp from "../pages/Signup";
import useLocalStorage from "../customHooks/useLocalStorage";
import Published from "../pages/Published";
import TodayScheduled from "../pages/TodayScheduled";
import Bookmark from "../pages/Bookmark";
import { useAuthContext } from "../auth/AuthContext";

export default function Approutes() {
  // const [currentUser , setCurrentUser] = useLocalStorage("kanban-current-user", null)
  const {currentUser, loading} = useAuthContext();

  if(loading) return <div>loading...</div>
  return (
    <Routes>
            <Route path="/login" element={<Login />}/>
            <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/" element={<Dashboard />}>
            <Route index element={<General/>}/>
            <Route path="/board" element={<Board />}/>
            <Route path="/report" element={<Report/>}/>
            <Route path="/setting" element={<Setting/>}/>
            <Route path="/published" element={<Published/>}/>
            <Route path="/today-scheduleds" element={<TodayScheduled/>}/>
            <Route path="/bookmark" element={<Bookmark/>}/>
        </Route> 
    </Routes>
  )
}