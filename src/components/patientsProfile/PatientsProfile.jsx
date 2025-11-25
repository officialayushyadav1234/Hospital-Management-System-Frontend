import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for redirection
import axios from "axios";
import style from "./patientsProfile.module.css";

const PatientsProfile = () => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading status
  const [error, setError] = useState(""); // Track errors
  
  const navigate = useNavigate();
  const patientId = sessionStorage.getItem("id");

  useEffect(() => {
    // 1. FIX BLANK PAGE: If no ID found, kick user back to login
    if (!patientId) {
      alert("Session expired. Please login again.");
      navigate("/login"); // Change '/login' to your actual login route
      return;
    }

    setLoading(true);

    axios
      .get(`https://hospital-management-system-backend-wrco.onrender.com/api/patient/${patientId}`)
      .then((response) => {
        setPatient(response.data);
        setLoading(false); // Data loaded, stop loading
      })
      .catch((error) => {
        console.error("Error fetching patient data:", error);
        setError("Unable to fetch data. Server might be waking up (wait 1 min) or network is down.");
        setLoading(false);
      });
  }, [patientId, navigate]);

  // 2. SHOW LOADING SPINNER (UI fix for "Buffering")
  if (loading) {
    return (
      <div className={style.patientsProfileContainer}>
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h2>Loading Profile...</h2>
          <p>Please wait, connecting to server...</p>
          {/* You can add a CSS spinner here */}
        </div>
      </div>
    );
  }

  // 3. SHOW ERROR MESSAGE
  if (error) {
    return (
      <div className={style.patientsProfileContainer}>
        <h3 style={{ color: "red", textAlign: "center" }}>{error}</h3>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className={style.patientsProfileContainer}>
      <div className={style.titleBar}>
        <h1>Profile</h1>
        <img
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
          alt="Profile"
          className={style.profileImage}
        />
        <button className={style.editButton}>Edit</button>
      </div>
      
      {patient && (
        <div className={style.profileContent}>
          <div className={style.patientInfo}>
            <h1>
              <strong>Name:</strong> {patient.firstName} {patient.lastName}
            </h1>
            <p><strong>Contact:</strong> {patient.contactNumber}</p>
            <p><strong>Email:</strong> {patient.email}</p>
            <p><strong>Date of Birth:</strong> {patient.dateOfBirth}</p>
            <p><strong>Gender:</strong> {patient.gender}</p>
            <p><strong>Address:</strong> {patient.address}</p>
            <p><strong>Emergency Contact:</strong> {patient.emergencyContact}</p>
            <p><strong>Blood Type:</strong> {patient.bloodType}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsProfile;