import "./Attendance.css";
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../firebase";

import Papa from "papaparse";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AttendanceMatrix() {

  const today = new Date().toISOString().slice(0,10);

  const [students, setStudents] = useState({});
  const [attendance, setAttendance] = useState({});
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);

  /* ---------- LOAD STUDENTS ---------- */
  useEffect(() => {
    return onValue(ref(rtdb, "students"), snap => {
      setStudents(snap.val() || {});
    });
  }, []);

  /* ---------- LOAD ATTENDANCE ---------- */
  useEffect(() => {
    return onValue(ref(rtdb, "attendance"), snap => {
      setAttendance(snap.val() || {});
    });
  }, []);

  /* ---------- BUILD DATE LIST ---------- */

  const getDatesBetween = (start, end) => {
    const dates = [];
    let d = new Date(start);
    const last = new Date(end);

    while (d <= last) {
      dates.push(d.toISOString().slice(0,10));
      d.setDate(d.getDate() + 1);
    }
    return dates;
  };

  const dateList = getDatesBetween(fromDate, toDate);

  /* ---------- BUILD ROWS ---------- */

  const rows = Object.keys(students).map(fid => {

    const daily = {};

    dateList.forEach(date => {
      daily[date] =
        attendance?.[date]?.[fid]?.status === "Present"
          ? "Present"
          : "Absent";
    });

    return {
      id: fid,
      name: students[fid]?.name || "Unknown",
      roll: students[fid]?.roll || "--",
      daily
    };
  });

  /* ---------- EXPORT CSV ---------- */

  const exportCSV = () => {

    const csvRows = rows.map(r => {
      const row = {
        ID: r.id,
        Name: r.name,
        Roll: r.roll
      };

      dateList.forEach(d => {
        row[d] = r.daily[d];
      });

      return row;
    });

    const csv = Papa.unparse(csvRows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `attendance_matrix_${fromDate}_to_${toDate}.csv`);
  };

  /* ---------- EXPORT PDF ---------- */

  const exportPDF = () => {

    const doc = new jsPDF("l"); // landscape

    autoTable(doc, {
      head: [[
        "ID",
        "Name",
        "Roll",
        ...dateList
      ]],
      body: rows.map(r => [
        r.id,
        r.name,
        r.roll,
        ...dateList.map(d => r.daily[d])
      ])
    });

    doc.save(`attendance_matrix_${fromDate}_to_${toDate}.pdf`);
  };

  /* ---------- UI ---------- */

  return (
    <div className="attendance-container">

      <h1>Attendance Matrix</h1>

      <div className="controls">

        <input
          type="date"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
        />

        <input
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
        />

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
              {dateList.map(d => (
                <th key={d}>{d}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.roll}</td>

                {dateList.map(d => (
                  <td
                    key={d}
                    className={r.daily[d] === "Present" ? "present" : "absent"}
                  >
                    {r.daily[d]}
                  </td>
                ))}

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AttendanceMatrix;
