import { useEffect, useState } from "react";
import axios from "axios"; // Make sure you have axios installed, or switch back to fetch if needed
import style from "./doctorAppointByPatients.module.css";
import { useNavigate } from "react-router-dom";

const DoctorAppointByPatients = () => {
  // Initialize appointments as an empty array to prevent initial render crashes
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Get the ID (Using sessionStorage as per your UI code)
    // Note: If you use localStorage, change this line to: const doctorId = JSON.parse(localStorage.getItem("doctor"))?.id;
    const doctorId = sessionStorage.getItem("id");

    // 2. Get local date in YYYY-MM-DD format for default selection
    const today = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    const localToday = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    setSelectedDate(localToday);

    // 3. SAFETY CHECK: Do not run the API call if ID is missing/null
    if (!doctorId) {
      console.error("Doctor ID is missing in sessionStorage. Cannot fetch appointments.");
      return;
    }

    // 4. Fetch Data (Using axios for better error handling)
   // 4. Fetch Data
    axios.get(`http://localhost:8181/api/appointment/doctorId/${doctorId}`)
      .then((response) => {
        const data = response.data;
        console.log("API RAW DATA:", data); // Check this log in console!

        // CASE A: Data is a valid array (Perfect scenario)
        if (Array.isArray(data)) {
          setAppointments(data);
          const uniqueDates = [...new Set(data.map((appt) => appt.appointmentDate))].sort();
          setAvailableDates(uniqueDates);
        } 
        // CASE B: Data is an empty string or null (Treat as empty list)
        else if (data === "" || data === null) {
          console.warn("API returned empty data. Setting appointments to [].");
          setAppointments([]); 
          setAvailableDates([]);
        }
        // CASE C: Data is wrapped in an object (e.g., Pageable or Custom Response)
        else if (data.content && Array.isArray(data.content)) {
           // Common in Spring Boot pagination
           console.log("Found data inside .content");
           setAppointments(data.content);
           const uniqueDates = [...new Set(data.content.map((appt) => appt.appointmentDate))].sort();
           setAvailableDates(uniqueDates);
        }
        // CASE D: Unknown format
        else {
          console.error("API returned invalid format:", data);
          setAppointments([]); 
        }
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
        setAppointments([]); 
      });
  }, []);

  const handleViewPatient = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  // 6. Safe Filtering: Ensure appointments is an array before filtering
  const filteredAppointments = Array.isArray(appointments) 
    ? appointments.filter((appt) => appt.appointmentDate === selectedDate)
    : [];

  return (
    <div className={style.doctorAppointByPatientsContainer}>
      <h1>Appointments for {selectedDate}</h1>

      <div className={style.dropdownContainer}>
        <label>Select Date: </label>
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className={style.dateDropdown}
        >
          {availableDates.length > 0 ? (
            availableDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))
          ) : (
             <option value={selectedDate}>{selectedDate}</option>
          )}
        </select>
      </div>

      {filteredAppointments.length === 0 ? (
        <p>No appointments for selected date.</p>
      ) : (
        <table className={style.appointmentTable}>
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>Patient Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appt) => (
              <tr key={appt.appointmentId}>
                <td>{appt.appointmentId}</td>
                <td>
                  {appt.patient?.firstName} {appt.patient?.lastName}
                </td>
                <td>{appt.patient?.email}</td>
                <td>{appt.patient?.contactNumber}</td>
                <td>
                  <button
                    onClick={() => handleViewPatient(appt.patient?.patientId)}
                    className={style.viewButton}
                  >
                    View Patient
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DoctorAppointByPatients;