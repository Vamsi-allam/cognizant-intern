import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import ProtectedRoute from "./Components/ProtectedRoute";
import SignIn from "./Components/SignIn";
import Side from "./Components/Side";
import Dashboard from "./Components/Dashboard";
import AtmDetails from "./Components/AtmDetails";
import Home from "./Components/Home";
import ForgotPassword from "./Components/ForgotPassword";
import Atm from "./Components/Atm";
import Register from "./Components/Register";

import "./App.css"
import AtmTable from "./Components/Atmtable";
const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <Provider store={store}>
      <div className={darkMode ? "dark-mode" : "light-mode"}>
        <Router>
          <Routes>
            {/* Login Page */}
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/register" element={<Register />} />{" "}
            <Route path="/Home" element={<Home />} />
            {/* Added Register Route */}
            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div style={{ display: "flex" }}>
                    {/* Sidebar */}
                    <Side onSidebarToggle={setIsSidebarOpen} />

                    {/* Main Content Area */}
                    <main
                      className="container-fluid"
                      style={{
                        marginLeft: isSidebarOpen ? "250px" : "60px",
                        width: `calc(100% - ${
                          isSidebarOpen ? "250px" : "60px"
                        })`,
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Routes>
                        {/* Dashboard Page (Replaces Atmtable) */}
                        <Route
                          path="dashboard"
                          element={
                            <ProtectedRoute allowedRoles={["ADMIN","TECHNICIAN"]}>
                              <Dashboard
                                darkMode={darkMode}
                                toggleDarkMode={toggleDarkMode}
                              />
                            </ProtectedRoute>
                          }
                        />

                        {/* ATM Details Page */}
                        <Route
                          path="atm/:atmId"
                          element={
                            <ProtectedRoute
                              allowedRoles={["ADMIN", "TECHNICIAN"]}
                            >
                              <AtmDetails
                                darkMode={darkMode}
                                toggleDarkMode={toggleDarkMode}
                              />
                            </ProtectedRoute>
                          }
                        />

                        {/* Analytics Page */}
                        <Route
                          path="atm"
                          element={
                            <ProtectedRoute
                              allowedRoles={["ADMIN"]}
                            >
                              <AtmTable />
                            </ProtectedRoute>
                          }
                        />

                        {/* Logs Page */}
                        <Route
                          path="logs"
                          element={
                            <ProtectedRoute allowedRoles={["ADMIN","TECHNICIAN"]}>
                              <Atm />
                            </ProtectedRoute>
                          }
                        />

                        {/* Redirect Based on Role */}
                        <Route
                          path=""
                          element={
                            <Navigate
                              to={
                                localStorage.getItem("userRole") === "TECHNICIAN"
                                  ? "atm"
                                  : "dashboard"
                              }
                              replace
                            />
                          }
                        />
                      </Routes>
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </div>
    </Provider>
  );
};

export default App;
