package com.example.dto;

import java.util.List;

public class LocationRequest {
    private int locationId;
    private String name;
    private List<BranchRequest> branches;
    public int getLocationId() {
        return locationId;
    }
    public void setLocationId(int locationId) {
        this.locationId = locationId;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public List<BranchRequest> getBranches() {
        return branches;
    }
    public void setBranches(List<BranchRequest> branches) {
        this.branches = branches;
    }
    public LocationRequest(int locationId, String name, List<BranchRequest> branches) {
        this.locationId = locationId;
        this.name = name;
        this.branches = branches;
    }
    public LocationRequest() {
    }
    
}
