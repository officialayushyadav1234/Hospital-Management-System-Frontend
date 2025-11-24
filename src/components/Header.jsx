// src/components/Header/Header.jsx
import { Link } from "react-router-dom";
import styles from "./Header.module.css"; // Importing CSS module

const Header = () => {
  return (
    <header className={styles.header}>
      {/* Logo */}
      <div className={styles.logo}>
        <Link to="/">
          <img src="/hospital_logo.png" alt="Hospital Logo" />
        </Link>
        <h1 className={styles.title}>Hospital Management</h1>
      </div>

      {/* Navigation Menu */}
      <nav>
        <ul className={styles.navLinks}>
          {/* <li><NavLink to="/">Home</NavLink></li> */}
          {/* <li><Link to="/doctor">Doctors</Link></li> */}
          {/* <li><Link to="/patient">Patients</Link></li> */}
          {/* <li><Link to="/appointments">Appointment</Link></li>  */}
          {/* <li><Link to="/admin">Admin</Link></li>  */}
          {/* <li><Link to="editByAdmin/:id">DoctorsEdit</Link></li>  */}
          {/* <li><Link to="patient/:id">DoctorAndPatientMeeting</Link></li>  */}
          {/* <li><Link to="/contact">Contact</Link></li>  */}
        </ul>
      </nav>

      {/* Login/Register */}
      <div className={styles.authButtons}>
        <Link to="/" className={styles.loginBtn}>
          Home
        </Link>
        <Link to="/login" className={styles.loginBtn}>
          Login
        </Link>
        <Link to="/register" className={styles.registerBtn}>
          Register
        </Link>
      </div>
    </header>
  );
};

export default Header;