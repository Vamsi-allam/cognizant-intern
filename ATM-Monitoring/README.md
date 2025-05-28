# 🏧 ATM Monitoring System

A comprehensive ATM monitoring application built with React, featuring user authentication, role-based access control, ATM status tracking, and responsive design.

## 🚀 Features

### Core Features
- **User Authentication** - Secure login with email or phone number
- **Role-Based Access** - Different permissions for Admin and Technician roles
- **ATM Monitoring** - Track and manage ATM status and details
- **Dashboard** - Comprehensive overview of all ATMs and their status
- **Password Recovery** - Secure password reset with security questions

### Advanced Features
- **Token-Based Authentication** - Secure JWT authentication
- **Responsive Design** - Works on all devices with adaptive layout
- **Protected Routes** - Role-based route protection
- **Dark Mode Support** - Toggle between light and dark themes
- **Visual Feedback** - Snackbar notifications for user actions
- **IoT Integration** - Azure IoT Hub for real-time ATM monitoring
- **Service Bus Integration** - Azure Service Bus for message processing
- **Temperature Monitoring** - Real-time temperature tracking for ATMs

## 🔧 Tech Stack

### Frontend
- **React** for UI components and logic
- **React Router** for navigation and protected routes
- **Redux** for state management
- **Material UI** for styling and components

### Backend
- **Spring Boot** for REST API and business logic
- **Spring Security** with JWT for authentication
- **JPA/Hibernate** for database operations
- **Azure IoT SDK** for IoT Hub integration
- **Azure Service Bus** for message processing
- **Lombok** for reducing boilerplate code

## 📁 Project Structure

### Frontend Structure
```
src/
├── Components/           # Reusable UI components
│   ├── SignIn.jsx        # Login component
│   ├── Register.jsx      # User registration
│   ├── ForgotPassword.jsx # Password recovery
│   ├── Dashboard.jsx     # Main dashboard
│   ├── AtmDetails.jsx    # ATM specific information
│   ├── Side.jsx          # Sidebar navigation
│   ├── ProtectedRoute.jsx # Role-based route protection
│   └── Home.jsx          # Landing page
├── redux/                # Redux state management
│   ├── store.js          # Redux store configuration
│   └── userSlice.js      # User authentication state
├── App.jsx              # Main app component with routing
├── main.jsx             # Application entry point
└── App.css              # Global styles
```

### Backend Structure
```
azure-iot-springboot/
├── src/main/java/com/example/
│   ├── controller/        # REST endpoints
│   │   ├── AuthController.java     # Authentication endpoints
│   │   ├── AtmController.java      # ATM IoT data endpoints
│   │   ├── BranchController.java   # Branch management
│   │   └── DataController.java     # ATM data management
│   │
│   ├── service/           # Business logic
│   │   ├── ServiceBusListener.java # Azure Service Bus integration
│   │   ├── AtmDetailsService.java  # ATM details processing
│   │   ├── JwtService.java         # JWT token handling
│   │   └── AtmService.java         # ATM data management
│   │
│   ├── repository/        # Data access layer
│   │   ├── AtmRepository.java      # ATM data access
│   │   ├── BranchRepository.java   # Branch data access
│   │   └── UserRepository.java     # User data access
│   │
│   ├── entity/            # Data models
│   │   ├── Atm.java            # ATM entity
│   │   ├── AtmCashflow.java    # Cash flow entity
│   │   ├── AtmTemperature.java # Temperature entity
│   │   ├── Branch.java         # Branch entity
│   │   └── User.java           # User entity
│   │
│   ├── dto/               # Data transfer objects
│   │   ├── AtmRequest.java        # ATM data request
│   │   ├── AtmDetailsRequest.java # ATM details request
│   │   ├── LoginRequest.java      # Login request
│   │   └── RegisterRequest.java   # Registration request
│   │
│   ├── config/            # Configuration
│   │   ├── SecurityConfig.java     # Security configuration
│   │   └── JwtAuthenticationFilter.java # JWT filter
│   │
│   └── AzureIotSpringbootApplication.java # Main application class
```

## ⚙️ Configuration Settings

When deploying this application, you'll need to update various configuration settings. Here's a guide to all the places where changes are needed:

### 1. Application Properties

Location: `azure-iot-springboot/src/main/resources/application.properties`

```properties
# Server Port Configuration
server.port=2003

# Database Connection
spring.datasource.url=jdbc:mysql://your-database-server:3306/your_database_name
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# JWT Configuration
jwt.secret=your_jwt_secret_key_should_be_at_least_64_characters_long
jwt.expiration=86400000  # 24 hours in milliseconds

# Logging Configuration
logging.level.org.springframework.security=DEBUG
logging.level.com.example=DEBUG
```

### 2. Azure Service Bus Connection

Location: `azure-iot-springboot/src/main/java/com/example/service/ServiceBusListener.java`

```java
// Update these connection strings with your Azure Service Bus details
private String connectionString = "Endpoint=sb://your-servicebus-namespace.servicebus.windows.net/;SharedAccessKeyName=your-key-name;SharedAccessKey=your-access-key;EntityPath=your-topic";
private String topicName = "your-topic-name";
private String subscriptionName = "your-subscription-name";
```

### 3. Azure IoT Hub Connection Strings

Location: `azure-iot-springboot/src/main/java/com/example/controller/AtmController.java`

```java
// Update these connection strings with your Azure IoT Hub device connection strings
private String connStringtemp = "HostName=your-iothub.azure-devices.net;DeviceId=your-temperature-device-id;SharedAccessKey=your-device-key";
private String connStringcash = "HostName=your-iothub.azure-devices.net;DeviceId=your-cash-device-id;SharedAccessKey=your-device-key";
```

### 4. Frontend API Endpoint Configuration

You need to update the API endpoint URL in various frontend components if your backend is not running on `http://localhost:2003`.

Files to modify:
- `src/Components/SignIn.jsx`
- `src/Components/Register.jsx`
- `src/Components/ForgotPassword.jsx`
- Any other component that makes API calls directly

Example pattern to look for:
```javascript
const response = await fetch("http://localhost:2003/auth/login", {
  // Change to your actual API endpoint
});
```

### 5. JWT Secret Key

For production deployments, set a strong JWT secret key in your configuration to ensure secure authentication.

### 6. CORS Configuration

If deploying frontend and backend separately, ensure CORS is properly configured in the Spring Boot application.

Location: Create or modify `azure-iot-springboot/src/main/java/com/example/config/WebConfig.java`

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://your-frontend-domain.com")
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowCredentials(true);
    }
}
```

## 🚀 Quick Start

### Frontend

1. **Install Dependencies**
   ```bash
   npm install
   ```

   You can also install dependencies individually:

   ```bash
   # Core React packages
   npm install react react-dom
   
   # Routing
   npm install react-router-dom
   
   # Redux
   npm install redux react-redux @reduxjs/toolkit
   
   # Material UI
   npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Open the application**
   Navigate to [http://localhost:5173](http://localhost:5173)

### Backend

1. **Build with Maven**
   ```bash
   cd azure-iot-springboot
   ./mvnw clean install
   ```

2. **Run the Application**
   ```bash
   ./mvnw spring-boot:run
   ```

3. **Access the API**
   The API will be available at [http://localhost:2003](http://localhost:2003)

## 📊 Key Components

### Authentication System
- **User Login** - Email/Phone and password authentication
- **User Registration** - New user account creation
- **Password Recovery** - Security question-based password reset
- **Role-Based Access** - Admin and Technician permission levels
- **JWT Integration** - Secure token-based sessions

### ATM Monitoring Dashboard
- **ATM Overview** - Summary of all ATM statuses
- **Status Indicators** - Visual representation of ATM health
- **Filter and Search** - Find specific ATMs quickly
- **Data Visualization** - Charts and graphs of ATM performance
- **Responsive Layout** - Mobile and desktop optimized views

### Admin Features
- **ATM Management** - Add, edit, and monitor ATMs
- **User Management** - Control access and permissions
- **Analytics Dashboard** - Performance metrics and reporting
- **System Logs** - Track activities and changes

### Technician Features
- **ATM Status Updates** - Report and update ATM conditions
- **Maintenance Logs** - Record service activities
- **Issue Tracking** - Manage and resolve ATM problems

### Azure IoT Integration
- **Temperature Monitoring** - Real-time tracking of ATM temperature
- **Cash Flow Management** - Track cash levels in ATMs
- **Service Bus Messaging** - Asynchronous message processing
- **IoT Device Communication** - Direct messaging with ATM devices

## 🎨 Design Features

- **Material Design** - Clean, modern UI with Material components
- **Dark/Light Mode** - Toggle between color schemes
- **Responsive Layout** - Works on mobile, tablet and desktop
- **Sidebar Navigation** - Collapsible sidebar for space efficiency
- **Toast Notifications** - User feedback with Snackbar alerts

## 🔧 Development Features

- **Protected Routes** - Role-based access control
- **Redux State Management** - Centralized application state
- **API Integration** - RESTful backend communication
- **JWT Authentication** - Secure token handling
- **Form Validation** - Input validation and error handling
- **Spring Boot Architecture** - Modular and maintainable backend design
- **Azure SDK Integration** - IoT and Service Bus communication

## 🔒 Security Features

- **Secure Authentication** - Email/Phone and password verification
- **Password Recovery** - Security question verification
- **JWT Tokens** - Encrypted authentication tokens
- **Role Validation** - Server and client-side permission checks
- **Protected Routes** - Authenticated access to sensitive areas
- **Spring Security** - Enterprise-level backend security

## 📱 User Experience

- **Intuitive Navigation** - User-friendly interface design
- **Error Handling** - Clear error messages and guidance
- **Loading States** - Visual feedback during data fetching
- **Form Validation** - Real-time input validation
- **Responsive Design** - Optimal experience across devices

## 🚀 Future Enhancements

- **Real-time Notifications** - Push notifications for critical events
- **Advanced Analytics** - Predictive maintenance alerts
- **Mobile App** - Native mobile application
- **Multi-language Support** - Internationalization
- **Two-Factor Authentication** - Enhanced security options
- **API Documentation** - Comprehensive API reference
- **Audit Logging** - Detailed system activity tracking

---

Built with React frontend and Spring Boot backend for modern, responsive ATM monitoring functionality.
