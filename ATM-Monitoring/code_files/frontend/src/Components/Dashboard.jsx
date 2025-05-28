import React, { useState, useEffect } from "react";
import {
  FaBuilding,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "@fontsource/roboto";
import "../Components/Dashboard.css";

const Dashboard = ({ darkMode, toggleDarkMode }) => {
  const [atms, setAtms] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://127.0.0.1:2003/atm-details/atms", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch ATMs");
        return response.json();
      })
      .then((data) => setAtms(data))
      .catch((error) => console.error("Error fetching ATMs:", error));
  }, [token]);

  const totalATMs = atms.length;
  const activeATMs = atms.filter((atm) => atm.status === "Active").length;
  const inactiveATMs = totalATMs - activeATMs;

  return (
    <div className={`dashboard-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      <nav className="dashboard-navbar">
        <div className="dashboard-nav-spacer"></div>
        <div className="dashboard-nav-center">
          <h2 className="dashboard-title">List of ATMs</h2>
        </div>
        <button 
          className="dashboard-toggle-mode" 
          onClick={toggleDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
        </button>
      </nav>

      <div className="content">
        <div className="stats-container">
          {[
            { title: "Total ATMs", icon: <FaBuilding />, value: totalATMs },
            { title: "Active ATMs", icon: <FaCheckCircle />, value: activeATMs },
            { title: "Inactive ATMs", icon: <FaTimesCircle />, value: inactiveATMs },
          ].map((item, index) => (
            <div key={index} className="stats-box">
              <div className="stats-icon">{item.icon}</div>
              <h6 className="stats-title">{item.title}</h6>
              <p className="stats-value">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="atm-container">
          <h3 className="atm-header">ATM Details</h3>
          <div className="atm-list">
            {atms.map((atm) => (
              <Link key={atm.atmId} to={`/atm/${atm.atmId}`} className="atm-item">
                <span
                  className={`atm-id ${
                    atm.status === "Active"
                      ? "dashboard-active-atm"
                      : "dashboard-inactive-atm"
                  }`}
                >
                  {atm.atmCode}
                </span>
                <span className="atm-details">
                  Show Details <FaArrowRight />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
