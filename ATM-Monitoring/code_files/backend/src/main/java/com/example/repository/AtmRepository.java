package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entity.Atm;
@Repository

public interface AtmRepository extends JpaRepository<Atm, Integer> {
}