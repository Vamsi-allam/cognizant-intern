import React from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';
import atmImage from '../assets/Y.avif';
 
const Home = () => {
  const navigate = useNavigate();
 
  return (
    <div className="home-container">
      <nav className="home-navbar">
        <div className="home-logo">ATM-MONITORING</div>
        <div className="home-nav-links">
          <a href="#home" className="nav-link active">Home</a>
          {/* <a onClick={() => navigate('/about')} className="nav-link active">About Us</a> */}
          <a onClick={() => navigate('/login')} className="nav-link active">Login</a>
        </div>
      </nav>
 
      <div className="home-content">
        <div className="home-text">
          <h1 className="main-heading">Efficient ATM Management Solutions</h1>
          <p className="subheading">
            Monitor and manage ATMs efficiently with real-time updates and insights.
            Ensure seamless operations and enhanced customer satisfaction.
          </p>
          <button className="cta-button" onClick={() => navigate('/register')}>
            Register Here
          </button>
        </div>
 
        <div className="home-illustration">
          <img src={atmImage} alt="ATM Illustration" className="atm-illustration" />
        </div>
      </div>
    </div>
  );
};
 
export default Home;