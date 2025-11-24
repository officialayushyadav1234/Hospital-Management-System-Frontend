import { useState, useEffect } from "react";
import axios from "axios";
import style from "./getAppointment.module.css"; // Ensure this file exists
import { useNavigate } from "react-router-dom";

const GetAppointment = () => {
  const [appointmentDate, setAppointmentDate] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState(""); 
  const [problem, setProblem] = useState(""); 
  const [patient, setPatient] = useState(null);
  const [message, setMessage] = useState("");
  
  const navigate = useNavigate();

  // --- FIX 1: Safe Retrieval of Patient ID ---
  // This checks if ID exists AND ensures it is not the string "null"
  const getStoredId = () => {
    const storedId = sessionStorage.getItem("id");
    if (storedId && storedId !== "null" && storedId !== "undefined") {
        return parseInt(storedId, 10);
    }
    return null;
  };

  const patientId = getStoredId();

  // 1. Security Check: Redirect if no Patient ID
  useEffect(() => {
    if (!patientId) {
        alert("You are not logged in. Redirecting to Login...");
        navigate("/login"); // Make sure your login route is "/login"
    }
  }, [patientId, navigate]);

  // 2. Fetch all doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:8181/api/doctor");
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  // 3. Fetch patient details (Only if patientId exists)
  useEffect(() => {
    if (patientId) {
      const fetchPatient = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8181/api/patient/${patientId}`
          );
          setPatient(response.data);
        } catch (error) {
          console.error("Error fetching patient details:", error);
        }
      };
      fetchPatient();
    }
  }, [patientId]);

  // 4. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- VALIDATION ---
    if (!doctorId) {
        alert("Please select a doctor.");
        return;
    }
    if (!patientId) {
        alert("Session expired. Please log in again.");
        navigate("/login");
        return;
    }

    // --- PAYLOAD CONSTRUCTION ---
    // This nested structure matches your Java Entity relationships
    const payload = {
      appointmentDate: appointmentDate, 
      problem: problem,               
      status: "Pending", // <--- ADD THIS LINE
      doctor: {
        doctorId: parseInt(doctorId, 10) 
      },
      
      patient: {
        patientId: patientId 
      }
    };

    console.log("Sending Payload:", payload);

    try {
      const response = await axios.post("http://localhost:8181/api/appointment", payload);
      
      if (response.status === 200 || response.status === 201) {
          setMessage("Appointment booked successfully!");
          alert("Appointment booked successfully!");
          
          // Clear form
          setProblem("");
          setAppointmentDate("");
          setDoctorId("");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      if (error.response) {
          // Server responded with a status other than 200 range
          alert(`Booking Failed: ${error.response.data.message || error.response.data || "Server Error"}`);
      } else if (error.request) {
          // Request was made but no response received
          alert("Network Error: Server is not responding.");
      } else {
          alert("Error: " + error.message);
      }
    }
  };

  return (
    <div className={style.appointmentContainer}>
      <h2>Book an Appointment</h2>

      {/* Patient Information Display */}
      {patient && (
        <div className={style.patientInfo}>
          <p><strong>Patient:</strong> {patient.firstName} {patient.lastName}</p>
          <p><strong>Email:</strong> {patient.email}</p>
          <p><strong>Contact:</strong> {patient.contactNumber}</p>
        </div>
      )}

      <form className={style.appointmentForm} onSubmit={handleSubmit}>
        
        {/* Date Selection */}
        <label>Appointment Date:</label>
        <input
          type="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          required
        />

        {/* Problem Description */}
        <label>Reason for Visit:</label>
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Describe your symptoms..."
          rows="3"
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          required
        />

        {/* Doctor Selection */}
        <label>Select Doctor:</label>
        <select
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          required
        >
          <option value="">Choose a doctor</option>
          {doctors.map((doc) => (
            <option key={doc.doctorId} value={doc.doctorId}>
              {/* Handle cases where name might be stored as firstName or name */}
              {doc.name ? doc.name : doc.firstName} - {doc.specialization}
            </option>
          ))}
        </select>

        <button type="submit" className={style.submitButton}>
          Book Appointment
        </button>
        
        {message && <p className={style.message}>{message}</p>}
      </form>
    </div>
  );
};

export default GetAppointment;