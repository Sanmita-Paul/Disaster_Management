import './home.css';
import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

function Header(){
  const navigate = useNavigate();

  return (
    <div className='homepage'>
    <header>
      <img src="/logo.png" alt="logo" className="logo" />
      <h1>Disaster Management</h1>

      <button 
        className="login_btn"
        onClick={() => navigate("/login")}
      >
        Login
      </button>

      <button 
        className="signup_btn"
        onClick={() => navigate("/signup")}
      >
        Sign Up
      </button>
    </header>
    </div>
  );
}
function AlertMessage(){
    return(
        <div className="alert_bar">
            <p className="marquee_text">
            🚨 Flood Alert: Heavy rainfall expected in coastal areas 🚨
            </p>
        </div>
    )
}
function Slideshow() {
  const images = [
    "/img_1.png",
    "/img_2.png",
    "/img_3.png",
    "/img_4.png",
    "/img_5.png",
  ];
  const [current, setCurrent] = useState(0);

  //Next slide function
  function nextSlide() {
    setCurrent((current + 1) % images.length);
  }
  //Previous slide function
  function prevSlide() {
  setCurrent((current - 1 + images.length) % images.length);
  }


  //Auto slideshow (every 5 seconds)
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);

    // cleanup
    return () => clearInterval(timer);
  }, [current]);

  //JSX UI
  return (
    <div className="slideshow_wrapper">
  <img
    src={images[current]}
    alt="slideshow"
    className="slide_image"
  />

  <button className="nav_btn prev" onClick={prevSlide}>
    ‹
  </button>

  <button className="nav_btn next" onClick={nextSlide}>
    ›
  </button>
</div>

  );
}

function Footer(){
  return(
    <footer>
      <p>&copy; 2026 Disaster Management. All rights reserved.</p>
    </footer>
  )
}

export function Home() {
  return (
    <div className="page_container">
      <Header />
      <AlertMessage />
      <Slideshow />
      <Footer />
    </div>
  );
}
