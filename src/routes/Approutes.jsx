import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import General from "../pages/General";
import Board from "../pages/Board";
import Report from "../pages/Report";
import Setting from "../pages/Setting";
import Login from "../pages/Login";
import SignUp from "../pages/Signup";
import Published from "../pages/Published";
import TodayScheduled from "../pages/TodayScheduled";
import Bookmark from "../pages/Bookmark";
import ResetPassword from "../pages/ResetPasswordPage";
import { useAuthContext } from "../auth/AuthContext";
import Faq from "../pages/faq";

export default function Approutes() {
  
  const {currentUser, loading} = useAuthContext();

  if(loading) return <div>loading...</div>
  return (
    <Routes>
            <Route path="/login" element={<Login />}/>
            <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/" element={<Dashboard />}>
            <Route index element={<General/>}/>
            <Route path="/task/:taskId" element={<General/>}/>
            <Route path="/board" element={<Board />}/>
            <Route path="/report" element={<Report/>}/>
            <Route path="/setting" element={<Setting/>}/>
            <Route path="/published" element={<Published/>}/>
            <Route path="/today-scheduleds" element={<TodayScheduled/>}/>
            <Route path="/bookmark" element={<Bookmark/>}/>
            <Route path="/faq" element={<Faq/>}/>
        </Route> 
            <Route path="/reset-password" element={<ResetPassword/>}/>
    </Routes>
  )
}