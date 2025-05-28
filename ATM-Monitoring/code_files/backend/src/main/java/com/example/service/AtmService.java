package com.example.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dto.AtmCashFlowRequest;
import com.example.dto.AtmRequest;
import com.example.dto.AtmTempRequest;
import com.example.entity.Atm;
import com.example.entity.AtmCashflow;
import com.example.entity.AtmTemperature;
import com.example.entity.Branch;
import com.example.repository.AtmCashflowRepository;
import com.example.repository.AtmRepository;
import com.example.repository.AtmTemperatureRepository;
import com.example.repository.BranchRepository;

import io.jsonwebtoken.lang.Collections;
import jakarta.transaction.Transactional;

@Service

public class AtmService {

    @Autowired

    private BranchRepository branchRepository;

    @Autowired
    private AtmCashflowRepository atmCashflowRepository;

    @Autowired
    private AtmTemperatureRepository atmTemperatureRepository;

    @Autowired

    private AtmRepository atmRepository;

    public List<Atm> getAllAtmDetails() {
        return atmRepository.findAll();
    }

    @Transactional

    public AtmRequest saveATM(AtmRequest atmDTO, int branchId) {

        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new RuntimeException("Branch not found"));

        Atm atm = new Atm();

        atm.setAtmCode(atmDTO.getAtmCode());
        atm.setStatus(atmDTO.getStatus());
        atm.setBranch(branch);
        Atm savedAtm = atmRepository.save(atm);

        return convertToDTO(savedAtm);

    }

    public AtmRequest getATMById(int id) {

        return atmRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("ATM not found"));

    }

    public List<AtmRequest> getAllATMs() {

        return atmRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

    }

    public List<AtmRequest> getATMsByBranchId(int branchId) {

        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new RuntimeException("Branch not found"));

        return branch.getAtms()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

    }

    @Transactional
    public AtmRequest updateATMStatus(int id, String status) {
        Atm atm = atmRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ATM not found"));

        atm.setStatus(status);

        Atm updatedAtm = atmRepository.save(atm);
        return convertToDTO(updatedAtm);
    }

    public Atm getAtmDetails(int id) {
        return atmRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ATM not found"));
    }

    public List<Atm> getAllAtmDetailsWithCashflowAndTemperature() {
        List<Atm> atms = atmRepository.findAll();
        for (Atm atm : atms) {
            List<AtmCashflow> cashflows = atmCashflowRepository.findByAtmId(atm.getAtmId());
            List<AtmTemperature> temperatures = atmTemperatureRepository.findByAtmId(atm.getAtmId());
            atm.setAtmCashFlow(cashflows);
            atm.setAtmTemperature(temperatures);
        }
        return atms;
    }

    private AtmRequest convertToDTO(Atm atm) {

        List<AtmCashFlowRequest> cashFlowDTOs = (atm.getAtmCashFlow() != null) ? atm.getAtmCashFlow().stream()
                .map(cashflow -> new AtmCashFlowRequest(
                cashflow.getCashFlowId(),
                cashflow.getCash100(),
                cashflow.getCash200(),
                cashflow.getCash500(),
                cashflow.getUpdatedAt()
        )).collect(Collectors.toList()) : Collections.emptyList();

        List<AtmTempRequest> temperatureDTOs = (atm.getAtmTemperature() != null) ? atm.getAtmTemperature().stream()
                .map(temp -> new AtmTempRequest(
                temp.getTempId(),
                temp.getTemperature(),
                temp.getRecordedAt()
        )).collect(Collectors.toList()) : Collections.emptyList();

        return new AtmRequest(
                atm.getAtmId(),
                atm.getAtmCode(),
                atm.getStatus(),
                temperatureDTOs,
                cashFlowDTOs
        );

    }

}
