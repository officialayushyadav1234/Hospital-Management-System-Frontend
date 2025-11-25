// src/pages/Home/Home.jsx
import styles from "./home.module.css";
import { Link } from "react-router-dom";
import Hero from "./Hero"; 

const doctors = [
  {
    title: "General Checkup",
    description: "Comprehensive health screenings and routine care for all ages.",
    // Image: Doctor with Patient
    image: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=80&w=500", 
  },
  {
    title: "Specialist Consultation",
    description: "Connect with top-tier specialists for cardiology, neurology, and more.",
    // Image: Specialist Doctor
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=500",
  },
  {
    title: "Emergency Care",
    description: "24/7 Rapid response teams equipped for critical medical situations.",
    // UPDATED IMAGE: Busy Hospital Hallway / Stretcher (Working Link)
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=500",
  },
];

const services = [
    {
        title: "Telemedicine",
        desc: "Consult doctors from the comfort of your home.",
        img: "https://cdn-icons-png.flaticon.com/512/3063/3063176.png"
    },
    {
        title: "Lab Diagnostics",
        desc: "High-tech labs for accurate and fast reporting.",
        img: "https://cdn-icons-png.flaticon.com/512/3209/3209074.png"
    },
    {
        title: "Advanced Surgery",
        desc: "Minimally invasive surgical procedures.",
        img: "https://cdn-icons-png.flaticon.com/512/2313/2313469.png"
    }
];

const Home = () => {
  return (
    <div className={styles.home}>
      {/* 1. Modern Hero Section */}
      <Hero /> 

      {/* 2. Doctor Services Section */}
      <section className={styles.doctorsContainer}>
        <div className={styles.sectionHeader}>
            <h2 className={styles.title}>Our Medical Team</h2>
            <p className={styles.subtitle}>Meet the experts dedicated to your well-being.</p>
        </div>

        <div className={styles.doctorsGrid}>
          {doctors.map((doctor, index) => (
            <div key={index} className={styles.doctorsCard}>
              <div className={styles.imageWrapper}>
                <img
                    src={doctor.image}
                    alt={doctor.title}
                    className={styles.image}
                />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.doctorsTitle}>{doctor.title}</h3>
                <p className={styles.description}>{doctor.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Services Section */}
      <section className={styles.services}>
        <div className={styles.sectionHeader}>
            <h2 className={styles.title}>Why Choose Us?</h2>
            <p className={styles.subtitle}>World-class facilities for your healthcare needs.</p>
        </div>

        <div className={styles.serviceGrid}>
            {services.map((service, index) => (
                 <div key={index} className={styles.serviceCard}>
                    <img src={service.img} alt={service.title} className={styles.serviceIcon} />
                    <h3>{service.title}</h3>
                    <p>{service.desc}</p>
                 </div>
            ))}
        </div>
      </section>

      {/* 4. Contact / CTA Section */}
      <section className={styles.contact}>
        <h2>Ready to prioritize your health?</h2>
        <p>
          Our team is available 24/7 to assist you. <br />
          Call us at <strong>+91 6201592239</strong>
        </p>
        <Link to="/contact">
          <button className={styles.contactButton}>Contact Us Now</button>
        </Link>
      </section>
    </div>
  );
};

export default Home;