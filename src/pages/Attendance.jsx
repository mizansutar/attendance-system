import "./Attendance.css";
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../firebase";

import Papa from "papaparse";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Attendance() {

  const today = new Date().toISOString().slice(0,10);

  const [students, setStudents] = useState({});
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(today);
  const [filter, setFilter] = useState("All");

  /* ---------- LOAD STUDENTS ---------- */
  useEffect(() => {
    return onValue(ref(rtdb, "students"), snap => {
      setStudents(snap.val() || {});
    });
  }, []);

  /* ---------- LOAD ATTENDANCE FOR DAY ---------- */
  useEffect(() => {
    return onValue(
      ref(rtdb, `attendance/${selectedDate}`),
      snap => {
        setAttendance(snap.val() || {});
      }
    );
  }, [selectedDate]);

  /* ---------- BUILD ROWS ---------- */

  const rows = Object.keys(students).map(fid => ({
    id: fid,
    name: students[fid]?.name || "Unknown",
    roll: students[fid]?.roll || "--",
    status: attendance[fid]?.status || "Absent",
    time: attendance[fid]?.time || "--"
  }));

  /* ---------- FILTER ---------- */

  const filteredRows =
    filter === "All"
      ? rows
      : rows.filter(r => r.status === filter);

  /* ---------- EXPORT CSV ---------- */

  const exportCSV = () => {
    const csv = Papa.unparse(filteredRows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `attendance_${selectedDate}.csv`);
  };

  /* ---------- EXPORT PDF ---------- */

  const exportPDF = () => {
    const doc = new jsPDF();

    autoTable(doc, {
      head: [["ID", "Name", "Roll", "Status", "Time"]],
      body: filteredRows.map(r => [
        r.id,
        r.name,
        r.roll,
        r.status,
        r.time
      ])
    });

    doc.save(`attendance_${selectedDate}.pdf`);
  };

  /* ---------- UI ---------- */

  return (
    <div className="attendance-container">

      <h1>Attendance</h1>

      <div className="controls">

        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
        />

        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>

        <button onClick={exportCSV}>Export CSV</button>
        <button onClick={exportPDF}>Export PDF</button>

      </div>

      <div className="table-card">

        <table>
          <thead>
            <tr>
              <th>Fingerprint ID</th>
              <th>Name</th>
              <th>Roll</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {filteredRows.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.roll}</td>
                <td className={r.status === "Present" ? "present" : "absent"}>
                  {r.status}
                </td>
                <td>{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
}

export default Attendance;
