package com.example.controller;
 
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.dto.BranchRequest;
import com.example.service.BranchService;
 
@RestController
@CrossOrigin("*")
@RequestMapping("/branches")
public class BranchController {
    @Autowired
    private BranchService branchService;
  @GetMapping
  @PreAuthorize("hasAuthority('ADMIN')")
  public List<BranchRequest> getAllBranches() {
    return branchService.getAllBranches();
  }
  @GetMapping("/{id}")
  public ResponseEntity<BranchRequest> getBranchById(@PathVariable int id) {
    Optional<BranchRequest> branch = branchService.getBranchById(id);
    return branch.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
 
  }
 
 
}
 