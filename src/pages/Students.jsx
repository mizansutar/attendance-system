import "./Students.css";
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../firebase";

function Students() {

  const [students, setStudents] = useState({});

  useEffect(() => {

    const studentsRef = ref(rtdb, "students");

    onValue(studentsRef, (snap) => {
      setStudents(snap.val() || {});
    });

  }, []);

  return (
    <div className="students-container">

      <h1>Students</h1>

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
            {Object.keys(students).map(id => (
              <tr key={id}>
                <td>{id}</td>
                <td>{students[id]?.name}</td>
                <td>{students[id]?.roll}</td>
                <td>{students[id]?.fingerprintId || "Not Set"}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Students;
