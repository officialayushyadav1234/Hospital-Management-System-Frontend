import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import style from "./appointment.module.css";
import { useNavigate } from "react-router-dom";

const Appointment = () => {
  const [formData, setFormData] = useState({
    date: "",
    message: "", // Maps to 'problem' in Java
    doctorId: "" // We need to select a doctor
  });
  
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 1. Get Logged In Patient ID
  const getPatientId = () => {
    const id = sessionStorage.getItem("id");
    if (id && id !== "null") return parseInt(id, 10);
    return null;
  };
  const patientId = getPatientId();

  // 2. Fetch Doctors on Load
  useEffect(() => {
    // If not logged in, redirect
    if (!patientId) {
      toast.error("Please login to book an appointment");
      navigate("/login"); 
      return;
    }

    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:8181/api/doctor");
        setDoctors(response.data);
      } catch (err) {
        console.error("Failed to load doctors", err);
        setError("Could not load doctor list.");
      }
    };
    fetchDoctors();
  }, [patientId, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.date || !formData.doctorId) {
      setError("Please select a date and a doctor.");
      return;
    }

    setLoading(true);

    // 3. Construct Payload matching your Java Entity
    const payload = {
      appointmentDate: formData.date,
      problem: formData.message,
      doctor: {
        doctorId: parseInt(formData.doctorId, 10)
      },
      patient: {
        patientId: patientId
      }
    };

    try {
      // Note: Make sure URL matches your Controller (@RequestMapping)
      const response = await axios.post(
        "http://localhost:8181/api/appointment",
        payload
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Appointment booked successfully!");
        // Reset form
        setFormData({
          date: "",
          message: "",
          doctorId: ""
        });
      }
    } catch (error) {
      console.error(error);
      const serverMsg = error.response?.data?.message || error.response?.data;
      setError(typeof serverMsg === 'string' ? serverMsg : "Failed to book appointment.");
      toast.error("Booking Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.appointmentPage}>
      <div className={style.appointmentContainer}>
        <h1>Book Appointment</h1>
        <p className={style.description}>
          Select a doctor and date for your visit.
        </p>
        
        <form onSubmit={handleSubmit} className={style.appointmentForm}>
          
          {/* Doctor Selection (REQUIRED by Backend) */}
          <label>Select Doctor</label>
          <select
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            required
            className={style.input}
            style={{ height: "45px", backgroundColor: "white" }} 
          >
            <option value="">-- Choose Doctor --</option>
            {doctors.map((doc) => (
              <option key={doc.doctorId} value={doc.doctorId}>
                 {/* Use doc.name or doc.firstName depending on your Entity */}
                {doc.name || doc.firstName} ({doc.specialization})
              </option>
            ))}
          </select>

          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className={style.input}
          />

          {/* Note: Your Java Entity 'Appointment.java' uses LocalDate. 
              It does not store Time. I removed Time input to avoid confusion. */}

          <label>Reason for Visit</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Describe your problem..."
            className={style.textarea}
          />

          {error && <p className={style.error} style={{color: "red"}}>{error}</p>}
          
          <button type="submit" className={style.button} disabled={loading}>
            {loading ? "Booking..." : "Confirm Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Appointment;