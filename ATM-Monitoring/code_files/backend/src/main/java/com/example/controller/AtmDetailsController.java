package com.example.controller;
 
import com.example.dto.AtmDetailsRequest;
import com.example.dto.AtmRequest;
import com.example.service.AtmDetailsService;
import com.example.service.AtmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
 
@RestController
@RequestMapping("/atm-details")
@CrossOrigin("*")
public class AtmDetailsController {
    @Autowired
    private AtmDetailsService atmDetailsService;
    @Autowired
    private AtmService atmService;
    @GetMapping("/{atmId}")
    public AtmDetailsRequest getAtmDetails(@PathVariable int atmId) {
        return atmDetailsService.getAtmDetails(atmId);
    }
    @GetMapping("/atms")
    public ResponseEntity<List<AtmRequest>> getAllATMs() {
        return ResponseEntity.ok(atmService.getAllATMs());
    }
   
}