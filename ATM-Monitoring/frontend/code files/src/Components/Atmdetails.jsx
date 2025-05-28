import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaMoon, FaSun, FaMapMarkerAlt, FaBuilding, FaMoneyBillWave, FaThermometerHalf, FaExclamationTriangle, FaPlus } from 'react-icons/fa';
import "../Components/AtmDetails.css";
import axios from 'axios';
import { Alert, Snackbar } from '@mui/material';

const AtmDetails = ({ darkMode, toggleDarkMode }) => {
  const { atmId } = useParams();
  const [atm, setAtm] = useState(null);
  const [atmLogs, setAtmLogs] = useState([]);
  const [totalCash, setTotalCash] = useState({ cash100: 0, cash200: 0, cash500: 0 });
  const [atmLocation, setAtmLocation] = useState(null);
  const [atmBranch, setAtmBranch] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [logView, setLogView] = useState('temp'); 

  const [temperature, setTemperature] = useState('');
  const [type, setType] = useState('');
  const [cash100, setCash100] = useState('');
  const [cash200, setCash200] = useState('');
  const [cash500, setCash500] = useState('');
  const [tempUnit, setTempUnit] = useState('celsius');

  const token = localStorage.getItem('token');

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert({ ...alert, open: false });
  };

  const showAlert = (message, severity) => {
    setAlert({
      open: true,
      message,
      severity
    });
  };

  useEffect(() => {
    const fetchData = () => {
      fetch("http://127.0.0.1:2003/locations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          let selectedAtm = null;
          let selectedLocation = null;
          let selectedBranch = null;
          let logs = [];
          let totalCash100 = 0, totalCash200 = 0, totalCash500 = 0;

          data.forEach(location => {
            location.branches.forEach(branch => {
              branch.atms.forEach(atm => {
                if (atm.atmId.toString() === atmId) {
                  selectedAtm = atm;
                  selectedLocation = location;
                  selectedBranch = branch;

                  const sortedCashLogs = [...atm.cash].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                  const sortedTempLogs = [...atm.temp].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

                  logs = sortedTempLogs.map(tempEntry => {
                    const cashEntry = sortedCashLogs.find(cash => new Date(cash.updatedAt) <= new Date(tempEntry.updatedAt));
                    return {
                      time: new Date(tempEntry.updatedAt).toLocaleString(),
                      temperature: tempEntry.temperature - 273.15,
                      cash100: cashEntry ? cashEntry.cash100 : 0,
                      cash200: cashEntry ? cashEntry.cash200 : 0,
                      cash500: cashEntry ? cashEntry.cash500 : 0,
                      isTemp: true // Mark as temperature log
                    };
                  }).concat(sortedCashLogs.map(cashEntry => ({
                    time: new Date(cashEntry.updatedAt).toLocaleString(),
                    temperature: 0,
                    cash100: cashEntry.cash100,
                    cash200: cashEntry.cash200,
                    cash500: cashEntry.cash500,
                    isTemp: false // Mark as cash log
                  }))).sort((a, b) => new Date(b.time) - new Date(a.time));

                  atm.cash.forEach(cashEntry => {
                    totalCash100 += cashEntry.cash100;
                    totalCash200 += cashEntry.cash200;
                    totalCash500 += cashEntry.cash500;
                  });
                }
              });
            });
          });

          setAtm(selectedAtm);
          setAtmLocation(selectedLocation);
          setAtmBranch(selectedBranch);
          setAtmLogs(logs);
          setTotalCash({ cash100: totalCash100, cash200: totalCash200, cash500: totalCash500 });
        })
        .catch(error => console.error("Error fetching ATM details:", error));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [atmId, token]);

  const convertToCelsius = (temp, unit) => {
    if (unit === 'kelvin') {
      return parseFloat(temp) - 273.15;
    }
    return parseFloat(temp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload;
    let endpoint;
    
    if (type === "1") {
      endpoint = 'http://localhost:2003/api/sendcash';
      payload = {
        type: 1,
        atm: {
          atmId: parseInt(atmId)
        },
        cash100: parseInt(cash100),
        cash200: parseInt(cash200),
        cash500: parseInt(cash500)
      };
    } else { 
      endpoint = 'http://localhost:2003/api/sendtemp';
      const tempInCelsius = convertToCelsius(temperature, tempUnit);
      payload = {
        temperature: tempInCelsius + 273.15, 
        atm: {
          atmId: parseInt(atmId)
        },
        type: "2"
      };
    }

    try {
      await axios.post(endpoint, payload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (type === "1") {
        showAlert('Cash details submitted successfully!', 'success');
      } else {
        showAlert('Temperature reading submitted successfully!', 'success');
      }

      setTemperature('');
      setType('');
      setCash100('');
      setCash200('');
      setCash500('');
    } catch (error) {
      console.error('Error submitting data:', error);
      showAlert('Error submitting data. Please try again.', 'error');
    }
  };

  if (!atm) return <p className="atm-loading-text">Loading ATM details...</p>;

  return (
    <div className={`atm-details-container ${darkMode ? "atm-dark-mode" : "atm-light-mode"}`}>
      <nav className="atm-navbar">
        <div className="atm-nav-spacer"></div> 
        <div className="atm-nav-left">
          <h2 className="atm-title">ATM Details - {atm?.atmCode}</h2>
        </div>
        <button 
          className="atm-toggle-mode" 
          onClick={toggleDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
        </button>
      </nav>

      <div className="atm-info-wrapper">
        <div className="atm-info-box">
          <FaBuilding size={30} />
          <p><strong>ATM Code:</strong> {atm.atmCode}</p>
          <p><strong>Status:</strong> <span className={atm.status === "Active" ? "text-success" : "text-danger"}>{atm.status}</span></p>
        </div>

        <div className="atm-info-box">
          <FaMapMarkerAlt size={30} />
          <p><strong>City:</strong> {atmLocation?.name || "Unknown"}</p>
          <p><strong>Branch:</strong> {atmBranch?.branchName || "Unknown"}</p>
        </div>

        <div className="atm-info-box">
          <FaMoneyBillWave size={30} />
          <h6>Total Notes</h6>
          <p><strong>100 Notes:</strong> {totalCash.cash100}</p>
          <p><strong>200 Notes:</strong> {totalCash.cash200}</p>
          <p><strong>500 Notes:</strong> {totalCash.cash500}</p>
          <p><strong>Total Cash Amount:</strong> ₹{(totalCash.cash100 * 100) + (totalCash.cash200 * 200) + (totalCash.cash500 * 500)}</p>
        </div>

        <div className="atm-info-box">
          <FaThermometerHalf size={30} />
          <h6>Latest Temperature</h6>
          <p><strong>Current:</strong> {parseFloat((atm.temp[atm.temp.length - 1]?.temperature - 273.15).toFixed(2))}°C</p>
        </div>
      </div>

      {(atm.status === "Active" && localStorage.getItem("userRole") === "TECHNICIAN") ? (
  <button className="add-details-btn" onClick={() => setShowForm(!showForm)}>
    <FaPlus size={20} />
    Add Details
  </button>
) : (
  <p className="atm-inactive-message">
    {atm.status === "Inactive" ? "This ATM is inactive, and no details can be added." : ""}
  </p>
)}

      {showForm && (
        <div className="atm-form">
          <h3>Submit ATM Details</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Type:</label>
              <select value={type} onChange={(e) => setType(e.target.value)} required>
                <option value="">Select Type</option>
                <option value="1">Cash</option>
                <option value="2">Temperature</option>
              </select>
            </div>

            {type === "1" && (
              <>
                <div className="cash-form-group">
                  <label>₹100 Notes:</label>
                  <input
                    type="number"
                    value={cash100}
                    onChange={(e) => setCash100(e.target.value)}
                    required
                  />
                </div>
                <div className="cash-form-group">
                  <label>₹200 Notes:</label>
                  <input
                    type="number"
                    value={cash200}
                    onChange={(e) => setCash200(e.target.value)}
                    required
                  />
                </div>
                <div className="cash-form-group">
                  <label>₹500 Notes:</label>
                  <input
                    type="number"
                    value={cash500}
                    onChange={(e) => setCash500(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {type === "2" && (
              <div className="temp-form-group">
                <label>Temperature:</label>
                <div className="temp-unit-selection">
                  <label>
                    <input
                      type="radio"
                      value="celsius"
                      checked={tempUnit === 'celsius'}
                      onChange={(e) => setTempUnit(e.target.value)}
                    /> Celsius
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="kelvin"
                      checked={tempUnit === 'kelvin'}
                      onChange={(e) => setTempUnit(e.target.value)}
                    /> Kelvin
                  </label>
                </div>
                <input
                  className="temp-input"
                  type="number"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  required
                  placeholder={`Enter temperature in ${tempUnit === 'celsius' ? '°C' : 'K'}`}
                />
              </div>
            )}

            <button type="submit" disabled={atm.status === "Inactive"}>Submit</button>
          </form>
        </div>
      )}

      <div className="log-toggle-buttons">
        <button onClick={() => setLogView('temp')} disabled={logView === 'temp'}>
          <FaThermometerHalf size={16} style={{ marginRight: '5px', color: 'inherit' }} />
          Temp Logs
        </button>
        <button onClick={() => setLogView('cash')} disabled={logView === 'cash'}>
          <FaMoneyBillWave size={16} style={{ marginRight: '5px', color: 'inherit' }} />
          Cash Logs
        </button>
      </div>

      {logView === 'temp' ? (
        <>
          <h3>Temperature Logs</h3>
          <table className="atm-log-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Temperature (°C)</th>
              </tr>
            </thead>
            <tbody>
              {atmLogs.filter(log => log.isTemp).map((log, index) => (
                <tr key={index} className={log.temperature > 35 ? "atm-high-temp-row" : ""}>
                  <td>{log.time}</td>
                  <td>
                    {parseFloat(log.temperature.toFixed(2))}°C{" "}
                    {log.temperature > 35 && (
                      <span className="tooltip-container">
                        <FaExclamationTriangle className="atm-alert-icon" />
                        <span className="tooltip">Temperature is more than 35°C</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <h3>Cash  Logs</h3>
          <table className="atm-log-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>₹100 Notes</th>
                <th>₹200 Notes</th>
                <th>₹500 Notes</th>
              </tr>
            </thead>
            <tbody>
              {atmLogs.filter(log => !log.isTemp).map((log, index) => (
                <tr key={index}>
                  <td>{log.time}</td>
                  <td>{log.cash100}</td>
                  <td>{log.cash200}</td>
                  <td>{log.cash500}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AtmDetails;
