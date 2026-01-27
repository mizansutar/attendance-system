import "./StudentRegister.css";
import { useEffect, useState } from "react";
import { ref, set, onValue } from "firebase/database";
import { rtdb } from "../firebase";

function StudentRegister() {

  const [studentId,setStudentId] = useState("");
  const [name,setName] = useState("");
  const [roll,setRoll] = useState("");
  const [fingerprintId,setFingerprintId] = useState("");

  /* ================= READ FINGERPRINT FROM STUDENTS NODE ================= */

  useEffect(()=>{

    const currentStudentRef = ref(rtdb,"control/currentStudent");

    onValue(currentStudentRef, snap=>{
      if(!snap.exists()) return;

      const sid = snap.val();

      const fpRef = ref(rtdb,"students/" + sid + "/fingerprintId");

      onValue(fpRef, fpSnap=>{
        if(fpSnap.exists()){
          setFingerprintId(String(fpSnap.val()));
        }
      });

    });

  },[]);

  /* ================= START SCAN ================= */

  const startScan = async ()=>{

    if(!studentId){
      alert("Enter Student ID");
      return;
    }

    await set(ref(rtdb,"control/mode"),"register");
    await set(ref(rtdb,"control/currentStudent"),String(studentId));

    alert("Place finger on sensor");
  };

  /* ================= SAVE STUDENT ================= */

  const saveStudent = async ()=>{

    if(!studentId || !name || !roll){
      alert("Fill all fields");
      return;
    }

    await set(ref(rtdb,`students/${studentId}`),{
      name: name.trim(),
      roll: roll.trim(),
      fingerprintId: fingerprintId || ""
    });

    alert("Student Registered Successfully");

    setStudentId("");
    setName("");
    setRoll("");
    setFingerprintId("");
  };

  /* ================= UI ================= */

  return (
    <div className="register-card">
      <div className="form-box">

        <h2>Student Registration</h2>

        <input
          placeholder="Student ID"
          value={studentId}
          onChange={e=>setStudentId(e.target.value)}
        />

        <input
          placeholder="Name"
          value={name}
          onChange={e=>setName(e.target.value)}
        />

        <input
          placeholder="Roll"
          value={roll}
          onChange={e=>setRoll(e.target.value)}
        />

        <input
          placeholder="Fingerprint ID"
          value={fingerprintId}
          disabled
        />

        <button onClick={startScan}>Start Scan</button>
        <button onClick={saveStudent}>Save Student</button>

      </div>
    </div>
  );
}

export default StudentRegister;
