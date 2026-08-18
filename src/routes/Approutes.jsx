import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import General from "../pages/General";
import Board from "../pages/Board";
import Report from "../pages/Report";
import Indox from "../pages/Indox";
import Setting from "../pages/Setting";
import Login from "../pages/Login";
import SignUp from "../pages/Signup";

export default function Approutes() {
  return (
    <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/" element={<Dashboard/>}>
            <Route index element={<General/>}/>
            <Route path="/board" element={<Board/>}/>
            <Route path="/report" element={<Report/>}/>
            <Route path="/indox" element={<Indox/>}/>
            <Route path="/setting" element={<Setting/>}/>
        </Route> 
    </Routes>
  )
}