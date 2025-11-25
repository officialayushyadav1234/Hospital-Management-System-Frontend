import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./hero.module.css";

const slides = [
  {
    id: 1,
    title: "World-Class Healthcare",
    subtitle: "Your health is our priority. Experience the future of medicine.",
    img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Expert Doctors",
    subtitle: "Top specialists dedicated to providing the best care possible.",
    img: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1932&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "24/7 Emergency",
    subtitle: "Always ready. Always open. We are here when you need us most.",
    img: "https://images.unsplash.com/photo-1516549655169-df83a092dd14?q=80&w=2070&auto=format&fit=crop",
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Auto-play logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 seconds is better for reading
    return () => clearInterval(interval);
  }, []);

  return (
    <section className={style.hero}>
      {/* Background Image Layer with Zoom Effect */}
      <div
        className={style.heroBackground}
        style={{ backgroundImage: `url(${slides[currentSlide].img})` }}
      ></div>

      {/* Dark Overlay for Text Readability */}
      <div className={style.overlay}></div>

      {/* Content Layer */}
      <div className={style.contentContainer}>
        <div className={style.textContent}>
          <span className={style.badge}>Welcome to Our Hospital</span>
          <h1 className={style.title}>{slides[currentSlide].title}</h1>
          <p className={style.subtitle}>{slides[currentSlide].subtitle}</p>
          
          <div className={style.buttonGroup}>
            <button
              className={style.primaryButton}
              onClick={() => navigate("/register")}
            >
              Book Appointment
            </button>
            <button className={style.secondaryButton}>Learn More</button>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className={style.dotsContainer}>
        {slides.map((_, index) => (
          <div
            key={index}
            className={`${style.dot} ${currentSlide === index ? style.activeDot : ""}`}
            onClick={() => setCurrentSlide(index)}
          ></div>
        ))}
      </div>
    </section>
  );
};

export default Hero;