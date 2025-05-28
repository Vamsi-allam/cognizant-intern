package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.entity.AtmTemperature;
import java.util.List;

@Repository
public interface AtmTemperatureRepository extends JpaRepository<AtmTemperature, Integer> {
    @Query("SELECT t FROM AtmTemperature t WHERE t.atm.atmId = :atmId")
    List<AtmTemperature> findByAtmId(@Param("atmId") int atmId);
}