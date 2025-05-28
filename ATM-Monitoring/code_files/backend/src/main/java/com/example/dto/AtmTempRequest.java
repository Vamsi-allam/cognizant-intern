package com.example.dto;

import lombok.AllArgsConstructor;
import lombok.*;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter 
public class AtmTempRequest {
    private int tempId;
    private double temperature;
    private String updatedAt;
    
}
