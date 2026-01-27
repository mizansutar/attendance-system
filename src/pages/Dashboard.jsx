import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../firebase";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function Dashboard() {

  const navigate = useNavigate();

  const [students,setStudents] = useState({});
  const [todayAttendance,setTodayAttendance] = useState({});

  /* ================= LOAD DATA ================= */

  useEffect(()=>{

    onValue(ref(rtdb,"students"), snap=>{
      setStudents(snap.val() || {});
    });

    const today = new Date().toISOString().slice(0,10);

    onValue(ref(rtdb,"attendance/"+today), snap=>{
      setTodayAttendance(snap.val() || {});
    });

  },[]);

  /* ================= METRICS ================= */

  const totalStudents = Object.keys(students).length;
  const presentToday = Object.keys(todayAttendance).length;
  const absentToday = totalStudents - presentToday;
  const attendanceRate = totalStudents
    ? Math.round((presentToday/totalStudents)*100)
    : 0;

  /* ================= CHART DATA ================= */

  const weeklyData = {
    labels: ["Mon","Tue","Wed","Thu","Fri"],
    datasets: [
      {
        label: "Attendance %",
        data: [attendanceRate,attendanceRate,attendanceRate,attendanceRate,attendanceRate],
        backgroundColor: "rgba(0,198,255,0.6)"
      }
    ]
  };

  const monthlyData = {
    labels: ["Week 1","Week 2","Week 3","Week 4"],
    datasets: [
      {
        label: "Students Present",
        data: [presentToday,presentToday,presentToday,presentToday],
        borderColor: "#00c6ff",
        backgroundColor: "rgba(0,198,255,0.2)",
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "white" } }
    },
    scales: {
      x: { ticks: { color: "white" } },
      y: { ticks: { color: "white" } }
    }
  };

  /* ================= UI ================= */

  return (
    <div className="dashboard-container">

      <h1 className="dash-title">Dashboard</h1>

      <div className="stats-grid">

        <div className="glass-card stat-card">
          <h2>{totalStudents}</h2>
          <p>Total Students</p>
        </div>

        <div className="glass-card stat-card">
          <h2>{presentToday}</h2>
          <p>Present Today</p>
        </div>

        <div className="glass-card stat-card">
          <h2>{absentToday}</h2>
          <p>Absent</p>
        </div>

        <div className="glass-card stat-card">
          <h2>{attendanceRate}%</h2>
          <p>Attendance Rate</p>
        </div>

      </div>

      <div className="analysis-grid">

        <div className="glass-card analysis-card chart-box">
          <h3>Weekly Attendance</h3>
          <Bar data={weeklyData} options={options} />
        </div>

        <div className="glass-card analysis-card chart-box">
          <h3>Monthly Trend</h3>
          <Line data={monthlyData} options={options} />
        </div>

      </div>

      <div className="card-grid">

        <div className="glass-card nav-card" onClick={()=>navigate("/students")}>
          Students
        </div>

        <div className="glass-card nav-card" onClick={()=>navigate("/attendance")}>
          Attendance
        </div>

        <div className="glass-card nav-card" onClick={()=>navigate("/register")}>
          Register
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
