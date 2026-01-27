import { Routes, Route } from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Attendance from "./pages/Attendance";
import AttendanceMatrix from "./pages/AttendanceMatrix";
import StudentRegister from "./pages/StudentRegister";
import Layout from "./pages/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/" element={<AdminLogin />} />

      {/* Protected */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/attendance-matrix" element={<AttendanceMatrix />} />
        <Route path="/register" element={<StudentRegister />} />

      </Route>

    </Routes>
  );
}

export default App;
