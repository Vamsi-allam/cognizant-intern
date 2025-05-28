package com.example.dto;

import lombok.AllArgsConstructor;
import lombok.*;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AtmCashFlowRequest {
    private int cashFlowId;
    private int cash100;
    private int cash200;
    private int cash500;
    private String updatedAt;
    
}
