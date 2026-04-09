import "./Students.css";
import { useEffect, useState } from "react";
import { ref, onValue, remove } from "firebase/database";
import { rtdb } from "../firebase";

function Students() {
  const [students, setStudents] = useState({});

  useEffect(() => {
    const studentsRef = ref(rtdb, "students");

    const unsubscribe = onValue(studentsRef, (snap) => {
      setStudents(snap.val() || {});
    });

    return () => unsubscribe();
  }, []);

  // 🔥 CLEAR ALL (students + control + attendance)
  const clearAllData = () => {
    if (window.confirm("Delete ALL data? (students + control + attendance)")) {

      Promise.all([
        remove(ref(rtdb, "students")),
        remove(ref(rtdb, "control")),
        remove(ref(rtdb, "attendance"))
      ])
      .then(() => {
        setStudents({}); // instantly clear UI
        console.log("All data cleared");
      })
      .catch((err) => console.error(err));
    }
  };

  return (
    <div className="students-container">
      <h1>Students</h1>

      <button
        className="clear-btn"
        onClick={clearAllData}
        disabled={!Object.keys(students).length}
      >
        Clear All Data
      </button>

      <div className="glass-card table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Roll</th>
              <th>Fingerprint</th>
            </tr>
          </thead>

          <tbody>
            {Object.keys(students).length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No Students Found
                </td>
              </tr>
            ) : (
              Object.keys(students).map((id) => (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{students[id]?.name}</td>
                  <td>{students[id]?.roll}</td>
                  <td>{students[id]?.fingerprintId || "Not Set"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Students;