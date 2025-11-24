import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import style from "./doctorProfile.module.css";

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const doctorId = sessionStorage.getItem("id");
  const navigate = useNavigate(); 

  useEffect(() => {
    if (doctorId) {
      // ✅ Correct Backend URL
      fetch(`http://localhost:8181/api/doctor/${doctorId}`)
        .then((response) => {
             if (!response.ok) {
                 throw new Error("Network response was not ok");
             }
             return response.json();
        })
        .then((data) => setDoctor(data))
        .catch((error) => console.error("Error fetching doctor data:", error));
    }
  }, [doctorId]);

  if (!doctor) {
    return <div className={style.loading}>Loading Profile...</div>;
  }

  // Function to handle Edit Click
  const handleEdit = () => {
    // ✅ FIX: This MUST match the path in your Router.jsx
    // Your router has: { path: "editByAdmin/:id", ... }
    navigate(`/editByAdmin/${doctorId}`);
  };

  return (
    <div className={style.doctorProfileContainer}>
      <h1 className={style.title}>Doctor Profile</h1>
      <div className={style.card}>
        <h1>{doctor.name}</h1>
        <p><strong>ID:</strong> {doctor.doctorId}</p>
        <p>
          <strong>Specialization:</strong> {doctor.specialization}
        </p>
        <p>
          <strong>Email:</strong> {doctor.email}
        </p>
        <p>
          <strong>Contact:</strong> {doctor.contactNumber}
        </p>
        <p>
          <strong>Experience:</strong> {doctor.experienceYears} years
        </p>
        <p>
          <strong>Clinic Address:</strong> {doctor.clinicAddress}
        </p>
        <p>
          <strong>Available Days:</strong> {doctor.availableDays}
        </p>
        <p>
          <strong>Consultation Fee:</strong> ${doctor.consultationFee}
        </p>
        
        <button className={style.editButton} onClick={handleEdit}>
            Edit Profile
        </button>
      </div>
    </div>
  );
};

export default DoctorProfile;