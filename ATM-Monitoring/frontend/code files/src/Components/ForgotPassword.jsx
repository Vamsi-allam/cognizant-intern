import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const ForgotPassword = () => {
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.padding = "";
      document.body.style.margin = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  const [identifier, setIdentifier] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSecurityVerified, setIsSecurityVerified] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [securityQuestions] = useState([
    "What was your first pet's name?",
    "What city were you born in?",
    "What is your favorite book?",
    "What was the name of your first school?"
  ]);
  const navigate = useNavigate();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const showMessage = (message, severity = "error") => {
    setSnackbarData({ message, severity });
    setSnackbarOpen(true);
  };

  const validateEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(identifier)) {
      showMessage("Please enter a valid email address");
      return;
    }

    try {
      const response = await fetch("http://localhost:2003/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: identifier,
          password: "dummy"
        }),
      });

      await response.json();
      
      if (response.status === 404) {
        showMessage("User not found");
      } else if (response.status === 401) {
        setIsEmailVerified(true);
        showMessage("Email verified successfully", "success");
      } else {
        showMessage("Unexpected error occurred");
      }
    } catch {
      showMessage("Error connecting to the server");
    }
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{4,12}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be 4-12 characters, include at least one capital letter, one number, and one special character"
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = () => {
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const verifySecurityQuestion = async () => {
    if (!securityQuestion || !securityAnswer) {
      showMessage("Please select a security question and provide an answer");
      return;
    }

    try {
      const response = await fetch("http://localhost:2003/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: identifier,
          security: securityQuestion,
          securityanswer: securityAnswer,
          newpassword: ""
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSecurityVerified(true);
        showMessage("Security answer verified successfully", "success");
      } else {
        showMessage(data.message || "Invalid security question or answer");
      }
    } catch {
      showMessage("Error validating security answer");
    }
  };

  const resetPassword = async () => {
    const isPasswordValid = validatePassword(newPassword);
    const isConfirmPasswordValid = validateConfirmPassword();

    if (!isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    try {
      const response = await fetch("http://localhost:2003/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: identifier,
          security: securityQuestion,
          securityanswer: securityAnswer,
          newpassword: newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage("Password reset successfully!", "success");
        setTimeout(() => navigate("/signin"), 1500);
      } else {
        showMessage(data.message || "Failed to reset password");
        if (data.message?.includes("security")) {
          setIsSecurityVerified(false);
        }
      }
    } catch {
      showMessage("Error connecting to the server");
    }
  };

  const handleKeyPress = (event, actionFunction) => {
    if (event.key === 'Enter') {
      actionFunction();
    }
  };

  return (
    <>
      <nav className="signin-navbar">
        <div className="signin-nav-left">ATM-MONITORING</div>
        <div className="signin-nav-right">
          <button onClick={() => navigate("/Home")} className="reg-nav-button">HomePage</button>
          <button className="signin-nav-button" onClick={() => navigate("/signin")}>Login In</button>
        </div>
      </nav>

      <div style={styles.container}>
        <div style={styles.formContainer}>
          <h2 style={styles.heading}>Forgot Password</h2>

          {!isEmailVerified ? (
            <form onSubmit={(e) => { e.preventDefault(); validateEmail(); }}>
              <input
                type="email"
                placeholder="Enter Email Address"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, validateEmail)}
                style={styles.input}
              />
              <button type="submit" style={styles.button}>
                Verify Email
              </button>
            </form>
          ) : (
            <>
              <div style={styles.verifiedEmailContainer}>
                <span style={styles.label}>Email:</span>
                <span style={styles.verifiedEmail}>{identifier}</span>
              </div>
              
              {!isSecurityVerified ? (
                <form onSubmit={(e) => { e.preventDefault(); verifySecurityQuestion(); }}>
                  <select
                    value={securityQuestion}
                    onChange={(e) => setSecurityQuestion(e.target.value)}
                    style={styles.select}
                  >
                    <option value="">Select a security question</option>
                    {securityQuestions.map((question, index) => (
                      <option key={index} value={question}>{question}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Your Answer"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, verifySecurityQuestion)}
                    style={styles.input}
                  />
                  <button type="submit" style={styles.button}>
                    Verify Answer
                  </button>
                </form>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); resetPassword(); }}>
                  <div style={styles.passwordContainer}>
                    <div>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        onBlur={() => validatePassword(newPassword)}
                        onKeyPress={(e) => handleKeyPress(e, resetPassword)}
                        style={styles.input}
                      />
                      {passwordError && <p style={styles.errorText}>{passwordError}</p>}
                    </div>
                    <div>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={validateConfirmPassword}
                        onKeyPress={(e) => handleKeyPress(e, resetPassword)}
                        style={styles.input}
                      />
                      {confirmPasswordError && <p style={styles.errorText}>{confirmPasswordError}</p>}
                    </div>
                    <div style={styles.checkboxContainer}>
                      <input
                        type="checkbox"
                        id="showPassword"
                        checked={showPassword}
                        onChange={(e) => setShowPassword(e.target.checked)}
                      />
                      <label htmlFor="showPassword">Show Password</label>
                    </div>
                    <button type="submit" style={styles.button}>
                      Reset Password
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={2000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarData.severity} 
          variant="filled" 
          sx={{ width: "100%" }}
        >
          {snackbarData.message}
        </Alert>
      </Snackbar>
    </>
  );
};

const styles = {
  container: {
    height: "85vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    fontFamily: "Arial, sans-serif",
  },
  formContainer: {
    width: "400px",
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  heading: {
    fontSize: "20px",
    marginBottom: "15px",
  },
  subHeading: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#9333ea",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  errorMessage: {
    color: "red",
    fontSize: "14px",
    marginTop: "10px",
  },
  toggleContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  toggleButton: {
    padding: '8px 20px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  select: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    boxSizing: "border-box",
    backgroundColor: "white",
    fontSize: "14px",
  },
  passwordContainer: {
    width: "100%",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "15px",
  },
  verifiedEmailContainer: {
    backgroundColor: '#f8f9fa',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'left',
    border: '1px solid #ddd',
  },
  label: {
    fontWeight: 'bold',
    marginRight: '10px',
    color: '#4b5563',
  },
  verifiedEmail: {
    color: '#1f2937',
  },
  errorText: {
    color: "#e57373",
    fontSize: "12px",
    marginTop: "-10px",
    marginBottom: "10px",
    textAlign: "left",
  },
};

export default ForgotPassword;