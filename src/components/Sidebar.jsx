import StudentRegister from "../pages/StudentRegister";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">

      <h2 className="logo">SmartPresence</h2>

      <nav>

        <NavLink to="/dashboard" className="link">
          Dashboard
        </NavLink>

        <NavLink to="/attendance" className="link">
          Daily Attendance
        </NavLink>

        <NavLink to="/register" className="link">
          StudentRegister
        </NavLink>

        <NavLink to="/attendance-matrix" className="link">
          Attendance Matrix
        </NavLink>

        <NavLink to="/students" className="link">
          Students
        </NavLink>

      </nav>

    </div>
  );
}

export default Sidebar;
