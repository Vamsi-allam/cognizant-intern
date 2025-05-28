package com.example.controller;
 
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import com.example.dto.AuthRequest;
import com.example.dto.JwtResponse;
import com.example.dto.RegisterRequest;
import com.example.repository.UserRepository;
import com.example.service.JwtService;
import com.example.entity.User;
 
@RestController
@CrossOrigin("*")
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
 
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            if (userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email ID already exists!"));
            }
            if (userRepository.existsByPhonenumber(request.getPhonenumber())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Phone number already exists!"));
            }
            User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phonenumber(request.getPhonenumber())
                .password(passwordEncoder.encode(request.getPassword()))
                .security(request.getSecurity())
                .securityanswer(passwordEncoder.encode(request.getSecurityanswer()))
                .role(request.getRole())
                .build();
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "An error occurred during registration"));
        }
    }
 
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            User user;
            if (request.getEmail() != null && !request.getEmail().isEmpty()) {
                user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            } else if (request.getPhonenumber() != null && !request.getPhonenumber().isEmpty()) {
                user = userRepository.findByPhonenumber(request.getPhonenumber())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Email or phone number is required"));
            }
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ResponseEntity.status(401).body(Map.of("message", "Invalid password"));
            }
            String token = jwtService.generateToken(user.getEmail());
            return ResponseEntity.ok(new JwtResponse(token, user.getName(), user.getEmail(),
                user.getPhonenumber(), user.getRole().name()));
        } catch (RuntimeException e) {
            if (e.getMessage().equals("User not found")) {
                return ResponseEntity.status(404).body(Map.of("message", "User not found"));
            }
            return ResponseEntity.status(500).body(Map.of("message", "An error occurred"));
        }
    }
 
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String phonenumber = request.get("phonenumber");
            String security = request.get("security");
            String securityanswer = request.get("securityanswer");
            String newpassword = request.get("newpassword");
           
            User user;
            if (email != null && !email.isEmpty()) {
                user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            } else if (phonenumber != null && !phonenumber.isEmpty()) {
                user = userRepository.findByPhonenumber(phonenumber)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Email or phone number is required"));
            }
           
            if (!user.getSecurity().equals(security)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Security question does not match"));
            }
            if (!passwordEncoder.matches(securityanswer, user.getSecurityanswer())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Security answer is incorrect"));
            }
           
            user.setPassword(passwordEncoder.encode(newpassword));
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
        } catch (RuntimeException e) {
            if (e.getMessage().equals("User not found")) {
                return ResponseEntity.status(404).body(Map.of("message", "User not found"));
            }
            return ResponseEntity.status(500).body(Map.of("message", "An error occurred during password reset"));
        }
    }
}