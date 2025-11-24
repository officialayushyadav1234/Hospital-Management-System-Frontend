import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "./login.module.css";

const Login = () => {
  const [activeUser, setActiveUser] = useState("patient");
  const [formData, setFormData] = useState({ id: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    let apiEndpoint = "";

    // ENCODE INPUTS: Ensures special characters like '@' or '#' don't break the URL
    const safeId = encodeURIComponent(formData.id);
    const safeEmail = encodeURIComponent(formData.email);
    const safePass = encodeURIComponent(formData.password);

    if (activeUser === "Doctor") {
      apiEndpoint = `https://hospital-management-system-backend-wrco.onrender.com/api/doctor/authenticate?doctorId=${safeId}&password=${safePass}`;
    } else if (activeUser === "patient") {
      apiEndpoint = `https://hospital-management-system-backend-wrco.onrender.com/api/patient/auth?patientId=${safeId}&password=${safePass}`;
    } else {
      // ✅ FIX: Updated to match the new AdminController structure
      apiEndpoint = `https://hospital-management-system-backend-wrco.onrender.com/api/authenticateAdmin/login?identifier=${safeEmail}&password=${safePass}`;
    }

    try {
      const response = await axios.post(apiEndpoint);
      
      // Check if response is literally true (boolean) or status 200
      if (response.data === true || response.status === 200) {
        
        if (activeUser === "admin") {
           sessionStorage.setItem("email", formData.email);
           sessionStorage.setItem("role", "admin"); // Good practice to store role
        } else {
           sessionStorage.setItem("id", formData.id);
        }

        navigate(`/${activeUser.toLowerCase()}`);
        toast.success("Login successful");
      } else {
        setError("Invalid credentials. Please try again.");
        toast.error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again later.");
      toast.error("Login failed. Check console for details.");
    }
  };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <h2 className={styles.title}>Login</h2>
        <div className={styles.toggleContainer}>
          <button
            className={`${styles.toggleButton} ${
              activeUser === "Doctor" ? styles.active : ""
            }`}
            onClick={() => setActiveUser("Doctor")}
          >
            Doctor
          </button>
          <button
            className={`${styles.toggleButton} ${
              activeUser === "patient" ? styles.active : ""
            }`}
            onClick={() => setActiveUser("patient")}
          >
            Patient
          </button>
          <button
            className={`${styles.toggleButton} ${
              activeUser === "admin" ? styles.active : ""
            }`}
            onClick={() => setActiveUser("admin")}
          >
            Admin
          </button>
        </div>
        <form className={styles.formContainer} onSubmit={handleSubmit}>
          {activeUser === "admin" ? (
            <>
              <label>Email</label>
              <input
                type="text"
                name="email"
                placeholder="Enter your email"
                className={styles.input}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </>
          ) : (
            <>
              <label>ID</label>
              <input
                type="text"
                name="id"
                placeholder="Enter your ID"
                className={styles.input}
                value={formData.id}
                onChange={handleChange}
                required
              />
            </>
          )}
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            className={styles.input}
            value={formData.password}
            onChange={handleChange}
            required
          />
          <a href="#" className={styles.forgotPassword}>
            Forgot Password?
          </a>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;