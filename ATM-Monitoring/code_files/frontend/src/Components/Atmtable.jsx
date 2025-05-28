import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaBuilding,
  FaCreditCard,
  FaToggleOn,
  FaToggleOff,
  FaPlus,
} from "react-icons/fa";
import "../Components/Atmtable.css";

const AtmTable = () => {
  const [atms, setAtms] = useState([]);
  const token = localStorage.getItem("token");
  const isDarkMode = localStorage.getItem("theme") === "dark";

  useEffect(() => {
    axios
      .get("http://127.0.0.1:2003/locations", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const formattedData = response.data.flatMap((location) =>
          location.branches.flatMap((branch) =>
            branch.atms.map((atm) => ({
              locationName: location.name,
              branchName: branch.branchName,
              atmId: atm.atmId,
              atmCode: atm.atmCode,
              status: atm.status,
            }))
          )
        );
        setAtms(formattedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [token]);

  const handleToggleStatus = (atmId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    axios
      .put(
        `http://127.0.0.1:2003/api/atms/${atmId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setAtms((prevAtms) =>
          prevAtms.map((atm) =>
            atm.atmId === atmId ? { ...atm, status: newStatus } : atm
          )
        );
      })
      .catch((error) => console.error("Error updating ATM status:", error));
  };

  return (
    <div className={`atm-table-container ${isDarkMode ? "dark-mode" : ""}`}>
      <h2 className="atm-table-title">ATM List</h2>

      <table className="atm-table-custom">
        <thead>
          <tr>
            <th>
              <FaMapMarkerAlt size={16} /> Location
            </th>
            <th>
              <FaBuilding size={16} /> Branch
            </th>
            <th>
              <FaCreditCard size={16} /> ATM Code
            </th>
            <th>Status</th>
            <th>Toggle</th>
          </tr>
        </thead>
        <tbody>
          {atms.map((atm) => (
            <tr key={`${atm.branchId}-${atm.atmId}`}>
              {" "}
              {/* Ensures uniqueness */}
              <td>{atm.locationName}</td>
              <td>{atm.branchName}</td>
              <td>{atm.atmCode}</td>
              <td
                className={
                  atm.status === "Active"
                    ? "atm-status-active"
                    : "atm-status-inactive"
                }
              >
                {atm.status}
              </td>
              <td>
                <button
                  className="atm-toggle-switch"
                  onClick={() => handleToggleStatus(atm.atmId, atm.status)}
                >
                  {atm.status === "Active" ? (
                    <FaToggleOn size={30} color="green" />
                  ) : (
                    <FaToggleOff size={30} color="red" />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AtmTable;
