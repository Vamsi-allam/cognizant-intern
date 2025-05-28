package com.example.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dto.AtmRequest;
import com.example.dto.BranchRequest;
import com.example.entity.Branch;
import com.example.entity.Location;
import com.example.repository.BranchRepository;
import com.example.repository.LocationRepository;

@Service
public class BranchService {

  @Autowired
  private BranchRepository branchRepository;

  @Autowired
  private LocationRepository locationRepository;

  public List<BranchRequest> getAllBranches() {
    return branchRepository.findAll()
        .stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
  }

  public Optional<BranchRequest> getBranchById(int id) {
    return branchRepository.findById(id).map(this::convertToDTO);
  }

  public BranchRequest saveBranch(BranchRequest branchDTO) {
    Location location = locationRepository.findById(branchDTO.getLocationId())
        .orElseThrow(() -> new RuntimeException("Location not found"));

    Branch branch = Branch.builder()
        .branchId(branchDTO.getBranchId())
        .branchName(branchDTO.getBranchName())
        .location(location)
        .build();

    Branch savedBranch = branchRepository.save(branch);
    return convertToDTO(savedBranch);
  }

  private BranchRequest convertToDTO(Branch branch) {
    List<AtmRequest> atmDTOs = new ArrayList<>();
    if (branch.getAtms() != null) {
        atmDTOs = branch.getAtms().stream()
            .map(atm -> new AtmRequest(
                branch.getBranchId(), 
                atm.getAtmCode(),
                atm.getStatus(),
                new ArrayList<>(),  
                new ArrayList<>()   
            ))
            .collect(Collectors.toList());
    }

    return new BranchRequest(
        branch.getBranchId(),
        branch.getBranchName(),
        branch.getLocation().getLocationId(),
        atmDTOs
    );
  }
}