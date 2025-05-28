package com.example.dto;

import java.util.List;

public class BranchRequest {
    private int branchId;
    private String branchName;
    private int locationId;
    private List<AtmRequest> atms;
    public BranchRequest() {
    }
    public BranchRequest(int branchId, String branchName, int locationId, List<AtmRequest> atms) {
        this.branchId = branchId;
        this.branchName = branchName;
        this.locationId = locationId;
        this.atms = atms;
    }
    public List<AtmRequest> getAtms() {
        return atms;
    }
    public void setAtms(List<AtmRequest> atms) {
        this.atms = atms;
    }
   
    public int getBranchId() {
        return branchId;
    }
    public void setBranchId(int branchId) {
        this.branchId = branchId;
    }
    public String getBranchName() {
        return branchName;
    }
    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }
    public int getLocationId() {
        return locationId;
    }
    public void setLocationId(int locationId) {
        this.locationId = locationId;
    }
    
}
