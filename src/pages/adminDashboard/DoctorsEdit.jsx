import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import style from "./DoctorsEdit.module.css"; // Make sure to create this CSS file

const DoctorsEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 1. State to hold all doctor data
  const [doctor, setDoctor] = useState({
    name: "",
    email: "",
    contactNumber: "",
    password: "", // Usually we don't edit password here, but keeping it for structure
    specialization: "",
    experienceYears: "",
    clinicAddress: "",
    availableDays: "",
    consultationFee: ""
  });

  const [loading, setLoading] = useState(true);

  // 2. Fetch Existing Data on Page Load
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`http://localhost:8181/api/doctor/${id}`);
        setDoctor(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching doctor:", error);
        toast.error("Failed to load doctor data.");
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  // 3. Handle Input Changes
  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  // 4. Submit Updated Data
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Send PUT request to update
      await axios.put(`http://localhost:8181/api/doctor/${id}`, doctor);
      
      toast.success("Doctor details updated successfully!");
      navigate("/admin"); // Redirect back to Admin Dashboard after save
    } catch (error) {
      console.error("Error updating doctor:", error);
      toast.error("Failed to update doctor.");
    }
  };

  if (loading) return <p>Loading doctor details...</p>;

  return (
    <div className={style.editContainer}>
      <h1>Edit Doctor Details (ID: {id})</h1>
      
      <form onSubmit={handleSubmit} className={style.editForm}>
        
        <div className={style.formGroup}>
          <label>Name</label>
          <input type="text" name="name" value={doctor.name} onChange={handleChange} required />
        </div>

        <div className={style.formGroup}>
          <label>Email</label>
          <input type="email" name="email" value={doctor.email} onChange={handleChange} required />
        </div>

        <div className={style.formGroup}>
          <label>Contact Number</label>
          <input type="text" name="contactNumber" value={doctor.contactNumber} onChange={handleChange} required />
        </div>

        <div className={style.formGroup}>
          <label>Specialization</label>
          <input type="text" name="specialization" value={doctor.specialization} onChange={handleChange} required />
        </div>

        <div className={style.formGroup}>
          <label>Experience (Years)</label>
          <input type="number" name="experienceYears" value={doctor.experienceYears} onChange={handleChange} required />
        </div>

        <div className={style.formGroup}>
          <label>Consultation Fee</label>
          <input type="number" name="consultationFee" value={doctor.consultationFee} onChange={handleChange} required />
        </div>

        <div className={style.formGroup}>
          <label>Clinic Address</label>
          <textarea name="clinicAddress" value={doctor.clinicAddress} onChange={handleChange} required />
        </div>

        <div className={style.formGroup}>
          <label>Available Days</label>
          <input 
            type="text" 
            name="availableDays" 
            value={doctor.availableDays} 
            onChange={handleChange} 
            placeholder="e.g. Mon, Wed, Fri"
            required 
          />
        </div>

        <button type="submit" className={style.updateButton}>Update Doctor</button>
      </form>
    </div>
  );
};

export default DoctorsEdit;