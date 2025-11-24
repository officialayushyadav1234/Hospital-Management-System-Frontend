import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate
import style from "./createDoctorNotes.module.css";
import { toast } from "react-hot-toast";

const CreateDoctorNotes = () => {
  const [noteContent, setNoteContent] = useState("");
  const [noteDetails, setNoteDetails] = useState(null);
  const { id } = useParams(); // Capture the ID from URL
  const navigate = useNavigate();

  // Helper to safely get IDs
  const getDoctorId = () => {
    const storedId = sessionStorage.getItem("id"); // Ensure this matches your login logic
    return storedId ? parseInt(storedId, 10) : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const doctorId = getDoctorId();
    const patientId = parseInt(id, 10);

    // --- VALIDATION: Stop the request if data is missing ---
    if (!doctorId) {
        toast.error("Doctor not logged in!");
        return;
    }
    if (!patientId || isNaN(patientId)) {
        toast.error("Invalid Patient ID");
        return;
    }
    if (!noteContent.trim()) {
        toast.error("Note content cannot be empty");
        return;
    }

    // Payload Construction
    const payload = {
      doctor: { doctorId: doctorId },
      patient: { patientId: patientId },
      noteContent: noteContent.trim(),
    };

    console.log("Sending Payload:", payload); // Debugging

    try {
      const response = await fetch("http://localhost:8181/api/doctor-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Note successfully created! ✅");
        setNoteDetails(data);
        setNoteContent(""); // Clear form
      } else {
        // Try to read server error message
        const errorText = await response.text();
        console.error("Server Error:", errorText);
        toast.error("Failed to create note. Check console.");
      }
    } catch (error) {
      console.error("Network Error:", error);
      toast.error("Server error. Try again later.");
    }
  };

  return (
    <div className={style.createDoctorNoteContainer}>
      <h1>Create Doctor Note</h1>
      <form onSubmit={handleSubmit} className={style.noteForm}>
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Enter note content..."
          required
          className={style.textarea}
        ></textarea>
        <button type="submit" className={style.submitButton}>
          Submit Note
        </button>
      </form>

      {noteDetails && (
        <div className={style.noteDetails}>
          <h2>Note Created Successfully!</h2>
          <p><strong>Note ID:</strong> {noteDetails.noteId}</p>
          {/* Safe checks in case doctor/patient objects aren't fully returned */}
          <p>
             <strong>Doctor:</strong> {noteDetails.doctor?.name || "Dr."} ({noteDetails.doctor?.specialization})
          </p>
          <p>
             <strong>Patient:</strong> {noteDetails.patient?.firstName} {noteDetails.patient?.lastName}
          </p>
          <p><strong>Content:</strong> {noteDetails.noteContent}</p>
          <p>
             <strong>Created At:</strong> {new Date().toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default CreateDoctorNotes;