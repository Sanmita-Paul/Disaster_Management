import './home.css';
import { useState, useEffect } from "react";

function Header(){
    return(
    <header>
        <img src="/logo.png" alt="logo" className="logo" />
        <h1>Disaster Management</h1>
        <a href="/login" target='_blank'>
          <button className="login-btn">Login</button>
        </a>
        <a href="/signup" target="_blank">
          <button className="signup-btn">Sign Up</button>
        </a>
    </header>
    )
}
function AlertMessage(){
    return(
        <div className="alert-bar">
            <p className="marquee-text">
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
    <div className="slideshow-wrapper">
  <img
    src={images[current]}
    alt="slideshow"
    className="slide-image"
  />

  <button className="nav-btn prev" onClick={prevSlide}>
    ‹
  </button>

  <button className="nav-btn next" onClick={nextSlide}>
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
    <>
      <Header />
      <AlertMessage />
      <Slideshow />
      <Footer />
    </>
  );
}
