package com.example.dto;
 
import com.example.entity.Role;
 
import lombok.*;
 
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String email;
    private String password;
    private String name;
    private String phonenumber;
    private Role role;
    private String security;
    private String securityanswer;
   
}