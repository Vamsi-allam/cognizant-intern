import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, clearUser } from '../redux/userSlice';
import { FaBars, FaTimes, FaUser, FaChartLine, FaHistory, FaSignOutAlt, FaHome, FaEnvelope, FaPhone, FaIdCard } from 'react-icons/fa';
import './Side.css';

const Side = ({ onSidebarToggle }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector(selectUser);
  
  console.log('userData from Redux:', userData);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    onSidebarToggle(!isOpen);
  };

  const toggleProfile = () => setShowProfile(!showProfile);

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
  };
  const userRole = localStorage.getItem('userRole'); 
  console.log(localStorage.getItem('userRole'));

  const menuItems = [
    { title: 'Dashboard', icon: <FaHome />, path: '/dashboard' },
    { title: 'Recent Logs', icon: <FaHistory />, path: '/logs' },
  ];

  if (userRole === "ADMIN") {
    menuItems.splice(1, 0, { title: 'ATM List', icon: <FaChartLine />, path: '/atm' });
  }

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h2>{isOpen ? 'ATM Monitor' : <FaBars />}</h2>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isOpen ? <FaTimes /> : null}
        </button>
      </div>

      <div className="menu-items">
        {menuItems.map((item, index) => (
          <div 
            key={index} 
            className="menu-item"
            onClick={() => navigate(item.path)}
          >
            <span className="icon">{item.icon}</span>
            {isOpen && <span className="title">{item.title}</span>}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="profile-section" onClick={toggleProfile}>
          <div className="profile-icon">
            <FaUser />
          </div>
          {isOpen && userData && (
            <div className="profile-info">
              <p className="username">{userData.name}</p>
              <p className="role">{userData.role}</p>
            </div>
          )}
        </div>

        {showProfile && isOpen && userData && (
          <div className="profile-details">
            <div className="profile-detail-item">
              <FaEnvelope className="detail-icon" />
              <span>{userData.email}</span>
            </div>
            <div className="profile-detail-item">
              <FaPhone className="detail-icon" />
              <span>{userData?.phone || 'No phone number'}</span>
            </div>
            <div className="profile-detail-item">
              <FaIdCard className="detail-icon" />
              <span>{userRole}</span>
            </div>
          </div>
        )}

        <div className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt />
          {isOpen && <span>Logout</span>}
        </div>
      </div>
    </div>
  );
};

export default Side;
