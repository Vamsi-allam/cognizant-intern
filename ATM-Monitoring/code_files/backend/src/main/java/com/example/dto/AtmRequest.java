package com.example.dto;

import java.util.List;

public class AtmRequest {
    private int atmId;
    public int getAtmId() {
        return atmId;
    }
    public void setAtmId(int atmId) {
        this.atmId = atmId;
    }
    private String atmCode;
    private String status;
    private List<AtmTempRequest> temp;
    private List<AtmCashFlowRequest> cash;

    public List<AtmTempRequest> getTemp() {
        return temp;
    }
    public void setTemp(List<AtmTempRequest> temp) {
        this.temp = temp;
    }
    public List<AtmCashFlowRequest> getCash() {
        return cash;
    }
    public void setCash(List<AtmCashFlowRequest> cash) {
        this.cash = cash;
    }
    public AtmRequest() {
    }
    public AtmRequest(int atmId, String atmCode, String status, List<AtmTempRequest> temp,
            List<AtmCashFlowRequest> cash) {
        this.atmId = atmId;
        this.atmCode = atmCode;
        this.status = status;
        this.temp = temp;
        this.cash = cash;
    }
   
    public String getAtmCode() {
        return atmCode;
    }
    public void setAtmCode(String atmCode) {
        this.atmCode = atmCode;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
   
    
}
