package com.example.controller;
 
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.dto.AtmRequest;
import com.example.entity.Atm;
import com.example.service.AtmService;
 
@RestController
@CrossOrigin("*")
@RequestMapping("/api/atms")
public class Datacontroller {
    @Autowired
    private AtmService atmService;
 
    @GetMapping
    public ResponseEntity<List<AtmRequest>> getAllATMs() {
        return ResponseEntity.ok(atmService.getAllATMs());
    }
 
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<AtmRequest> getATMById(@PathVariable int id) {
        return ResponseEntity.ok(atmService.getATMById(id));
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<AtmRequest> updateATM(@PathVariable int id, @RequestBody Map<String, String> requestBody) {
        String newStatus = requestBody.get("status");
        if (newStatus == null || (!newStatus.equalsIgnoreCase("Active") && !newStatus.equalsIgnoreCase("Inactive"))) {
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok(atmService.updateATMStatus(id, newStatus));
    }
 
 
 
    @GetMapping("/details")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<List<Atm>> getAllAtmDetailsWithCashflowAndTemperature() {
        return ResponseEntity.ok(atmService.getAllAtmDetailsWithCashflowAndTemperature());
    }
 
   
}