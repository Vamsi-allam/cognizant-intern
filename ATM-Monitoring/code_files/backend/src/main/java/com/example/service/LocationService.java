package com.example.service;
 
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
 
import org.springframework.stereotype.Service;
 
import com.example.dto.AtmCashFlowRequest;
import com.example.dto.AtmRequest;
import com.example.dto.AtmTempRequest;
import com.example.dto.BranchRequest;
import com.example.dto.LocationRequest;
import com.example.entity.Atm;
import com.example.entity.AtmCashflow;
import com.example.entity.AtmTemperature;
import com.example.entity.Branch;
import com.example.entity.Location;
import com.example.repository.LocationRepository;
 
@Service
public class LocationService {
 
    private final LocationRepository locationRepository;
    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }
    public List<LocationRequest> getAllLocations() {
        return locationRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
 
    public LocationRequest getLocationById(int id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found"));
        return convertToDTO(location);
    }
    private LocationRequest convertToDTO(Location location) {
        if (location == null) return null;
 
        LocationRequest dto = new LocationRequest();
        dto.setLocationId(location.getLocationId());
        dto.setName(location.getName());
 
        dto.setBranches(convertBranches(location.getBranches() != null ? location.getBranches() : new ArrayList<>()));
 
        return dto;
    }
 
    private List<BranchRequest> convertBranches(List<Branch> branches) {
        return branches.stream()
                .map(this::convertBranch)
                .collect(Collectors.toList());
    }
 
    private BranchRequest convertBranch(Branch branch) {
        return new BranchRequest(
                branch.getBranchId(),
                branch.getBranchName(),
                branch.getLocation().getLocationId(),
                convertAtms(branch.getAtms() != null ? branch.getAtms() : new ArrayList<>())
        );
    }
 
    private List<AtmRequest> convertAtms(List<Atm> atms) {
        return atms.stream()
                .map(this::convertAtm)
                .collect(Collectors.toList());
    }
 
    private AtmRequest convertAtm(Atm atm) {
        return new AtmRequest(
                atm.getBranch().getBranchId(),
                atm.getAtmCode(),
                atm.getStatus(),
                convertTemperatures(atm.getAtmTemperature() != null ? atm.getAtmTemperature() : new ArrayList<>()),
                convertCashFlows(atm.getAtmCashFlow() != null ? atm.getAtmCashFlow() : new ArrayList<>())
        );
    }
 
    private List<AtmCashFlowRequest> convertCashFlows(List<AtmCashflow> cashflows) {
        return cashflows.stream()
                .map(cf -> new AtmCashFlowRequest(
                        cf.getCashFlowId(),
                        cf.getCash100(),
                        cf.getCash200(),
                        cf.getCash500(),
                        cf.getUpdatedAt()
                ))
                .collect(Collectors.toList());
    }
 
    private List<AtmTempRequest> convertTemperatures(List<AtmTemperature> temperatures) {
        return temperatures.stream()
                .map(temp -> new AtmTempRequest(
                        temp.getTempId(),
                        temp.getTemperature(),
                        temp.getRecordedAt()
                ))
                .collect(Collectors.toList());
    }
}