import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ marginLeft: "230px", width: "100%" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
