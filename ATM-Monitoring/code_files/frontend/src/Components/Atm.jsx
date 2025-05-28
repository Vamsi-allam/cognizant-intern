import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Components/Atm.css';

function Atm() {
  const [locations, setLocations] = useState([]);
  const [branches, setBranches] = useState([]);
  const [atms, setAtms] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedAtm, setSelectedAtm] = useState('');
  const [atmDetails, setAtmDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchData = React.useCallback(async (url, setData) => {
    try {
      setLoading(true);
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchData('http://localhost:2003/locations', setLocations);
  }, [fetchData]);

  useEffect(() => {
    if (selectedLocation) {
      fetchData(`http://localhost:2003/locations/${selectedLocation}`, (data) => {
        setBranches(data.branches);
        setSelectedBranch('');
        setAtms([]);
        setSelectedAtm('');
        setAtmDetails(null);
      });
    }
  }, [selectedLocation, fetchData]);

  useEffect(() => {
    if (selectedBranch) {
      const selectedBranchData = branches.find(branch => branch.branchId === parseInt(selectedBranch));
      setAtms(selectedBranchData ? selectedBranchData.atms : []);
      setSelectedAtm('');
      setAtmDetails(null);
    }
  }, [selectedBranch, branches]);

  useEffect(() => {
    if (selectedAtm) {
      const fetchAtmDetails = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:2003/api/atms/${selectedAtm}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          const updatedDetails = response.data;
  
          let cashData = updatedDetails.cash && updatedDetails.cash.length > 0 ? updatedDetails.cash : null;
  
          if (!cashData || cashData.length === 0) {
            cashData = [{ cash100: 0, cash200: 0, cash500: 0 }];
          }
  
          updatedDetails.cash = cashData;
          setAtmDetails(updatedDetails);
          setLoading(false);
        } catch (err) {
          setLoading(false);
          console.error(err);
        }
      };
  
      fetchAtmDetails();
    }
  }, [selectedAtm, token]);

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
  };

  const handleAtmChange = (e) => {
    const atmCode = e.target.value;
    const selectedAtmDetails = atms.find(atm => atm.atmCode === atmCode);
    setSelectedAtm(atmCode);
    setAtmDetails(selectedAtmDetails);
  };

  const calculateTotalCash = (cash) => {
    if (!cash) return 0;
    return (cash.cash100 * 100) + (cash.cash200 * 200) + (cash.cash500 * 500);
  };

  const isTemperatureUpdated = atmDetails && atmDetails.temp && atmDetails.temp.length > 0;
  const isCashUpdated = atmDetails && atmDetails.cash && atmDetails.cash.length > 0;

  return (
    <div className="app-container">
      <h1>ATM Monitoring System</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="dropdown-container">
        <div className="dropdown-group">
          <label htmlFor="location">Location:</label>
          <select
            id="location"
            value={selectedLocation}
            onChange={handleLocationChange}
            disabled={loading}
          >
            <option value="">Select Location</option>
            {locations.map(location => (
              <option key={location.locationId} value={location.locationId}>
                {location.name}
              </option>
            ))}
          </select>
        </div>

        <div className="dropdown-group">
          <label htmlFor="branch">Branch:</label>
          <select
            id="branch"
            value={selectedBranch}
            onChange={handleBranchChange}
            disabled={!selectedLocation || loading}
          >
            <option value="">Select Branch</option>
            {branches.map(branch => (
              <option key={branch.branchId} value={branch.branchId}>
                {branch.branchName}
              </option>
            ))}
          </select>
        </div>

        <div className="dropdown-group">
          <label htmlFor="atm">ATM:</label>
          <select
            id="atm"
            value={selectedAtm}
            onChange={handleAtmChange}
            disabled={!selectedBranch || loading}
          >
            <option value="">Select ATM</option>
            {atms.map(atm => (
              <option key={atm.atmCode} value={atm.atmCode}>
                {atm.atmCode} 
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="loading">Loading...</div>}

      {atmDetails && (
        <div className="atm-details">
          <h2>ATM Details</h2>
          
          {isTemperatureUpdated && (
            <>
              <div className="detail-row">
                <span className="detail-label">Latest Temperature:</span>
                <span className="detail-value">
                  {atmDetails.temp[atmDetails.temp.length - 1].temperature-273.15}°C
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Recorded At:</span>
                <span className="detail-value">
                  {/* {atmDetails.temp[atmDetails.temp.length - 1].updatedAt} */}
                  {new Date(atmDetails.temp[atmDetails.temp.length - 1].updatedAt).toLocaleString()}
                </span>
              </div>
            </>
          )}

          {isCashUpdated && (
            <>
              <div className="detail-row">
                <span className="detail-label">₹100 Notes:</span>
                <span className="detail-value">
                  {atmDetails.cash[atmDetails.cash.length - 1].cash100}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">₹200 Notes:</span>
                <span className="detail-value">
                  {atmDetails.cash[atmDetails.cash.length - 1].cash200}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">₹500 Notes:</span>
                <span className="detail-value">
                  {atmDetails.cash[atmDetails.cash.length - 1].cash500}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Recorded At:</span>
                <span className="detail-value">
                {new Date(atmDetails.cash[atmDetails.cash.length - 1].updatedAt).toLocaleString()}
                </span>
              </div>
              <div className="detail-row total">
                <span className="detail-label">Total Cash:</span>
                <span className="detail-value">
                  ₹{calculateTotalCash(atmDetails.cash[atmDetails.cash.length - 1])}
                </span>
              </div>
              
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Atm;
