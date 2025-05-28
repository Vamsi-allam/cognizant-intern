package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.entity.AtmCashflow;
import java.util.List;

@Repository
public interface AtmCashflowRepository extends JpaRepository<AtmCashflow, Integer> {
    @Query("SELECT a FROM AtmCashflow a WHERE a.atm.atmId = :atmId")
    List<AtmCashflow> findByAtmId(@Param("atmId") int atmId);
}