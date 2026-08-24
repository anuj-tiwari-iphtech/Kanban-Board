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

export default function Approutes() {
  const [currentUser , setCurrentUser] = useLocalStorage("kanban-current-user", null)
  return (
    <Routes>
            <Route path="/login" element={<Login currentUser={currentUser} setCurrentUser={setCurrentUser}/>}/>
            <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/" element={<Dashboard currentUser={currentUser} setCurrentUser={setCurrentUser}/>}>
            <Route index element={<General/>}/>
            <Route path="/board" element={<Board currentUser={currentUser}/>}/>
            <Route path="/report" element={<Report/>}/>
            <Route path="/indox" element={<Indox/>}/>
            <Route path="/setting" element={<Setting currentUser={currentUser} setCurrentUser={setCurrentUser}/>}/>
        </Route> 
    </Routes>
  )
}