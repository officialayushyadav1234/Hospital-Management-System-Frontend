import PatientAppointmentList from "../../components/patientAppointments/PatientAppointmentList";
import PatientsProfile from "../../components/patientsProfile/PatientsProfile";
import GetAppointment from "../../components/patientAppointments/GetAppointment";
import DoctorNote from "../../components/doctorNotes/DoctorNote";
import style from "./patients.module.css";

const Patients = () => {
  return (
    <div className={style.patientsContainer}>
      <h1 className={style.pageTitle}>Patient Dashboard</h1>
      
      {/* Top Section: Cards */}
      <div className={style.cardsContainer}>
        <div className={style.card}>
          <GetAppointment />
        </div>
        <div className={style.card}>
          <PatientsProfile />
        </div>
      </div>

      {/* Middle Section: List */}
      <div className={style.listContainer}>
        <PatientAppointmentList />
      </div>

      {/* Bottom Section: Notes */}
      <div className={style.listContainer}>
        <DoctorNote />
      </div>
    </div>
  );
};

export default Patients;