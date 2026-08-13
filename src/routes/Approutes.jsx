import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import General from "../pages/General";
import Board from "../pages/Board";
import Report from "../pages/Report";
import Indox from "../pages/Indox";
import Setting from "../pages/Setting";

export default function Approutes() {
  return (
    <Routes>
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