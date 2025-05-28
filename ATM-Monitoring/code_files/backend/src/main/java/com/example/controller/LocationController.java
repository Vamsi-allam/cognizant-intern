package com.example.controller;
 
import com.example.dto.LocationRequest;
import com.example.service.LocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
 
@RestController
@CrossOrigin("*")
@RequestMapping("/locations")
public class LocationController {
    private final LocationService locationService;
 
    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }
    @GetMapping
    public ResponseEntity<List<LocationRequest>> getAllLocations() {
        return ResponseEntity.ok(locationService.getAllLocations());
    }
 
    @GetMapping("/{id}")
    public ResponseEntity<LocationRequest> getLocationById(@PathVariable int id) {
        return ResponseEntity.ok(locationService.getLocationById(id));
    }
 
   
}