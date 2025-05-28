package com.example.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AtmDetailsRequest {
    private int atmId;
    private String status;
    private int branchId;
    private String atmCode;
    private AtmTempRequest atmTemp;
    private List<AtmCashFlowRequest> atmCashFlows;
}
