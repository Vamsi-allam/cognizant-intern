package com.example.dto;

public class JwtResponse {
    private String token;
    private String name;
    private String email;
    private String phone;
    private String role;

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public JwtResponse(String token, String name, String email, String phone,String role) {
        this.token = token;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role=role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
    
}
