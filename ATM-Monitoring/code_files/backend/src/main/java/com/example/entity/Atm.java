package com.example.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Atm {
    @Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "atm_id")

    private int atmId;

    @Column(name = "atm_code", nullable = false)

    private String atmCode;

    @Column(name = "status", nullable = false)

    private String status;

    @ManyToOne(cascade = CascadeType.ALL)//one barnch can have multiple atms

    @JoinColumn(name = "branch_id", nullable = false)
    @JsonBackReference
    private Branch branch;

    @JsonIgnore
    @OneToMany(mappedBy = "atm", cascade = CascadeType.ALL, fetch = FetchType.LAZY)//one atm can have multiple temperatures

    private List<AtmTemperature> atmTemperature;

    @OneToMany(mappedBy = "atm", cascade = CascadeType.ALL, fetch = FetchType.LAZY)//one atm can
    @JsonIgnore
    private List<AtmCashflow> atmCashFlow;

    public List<AtmTemperature> getAtmTemperature() {
        return atmTemperature;
    }

    public void setAtmTemperature(List<AtmTemperature> atmTemperature) {
        this.atmTemperature = atmTemperature;
    }

    public Atm(int atmId, String atmCode, String status, Branch branch, List<AtmTemperature> atmTemperature,
            List<AtmCashflow> atmCashFlow) {
        this.atmId = atmId;
        this.atmCode = atmCode;
        this.status = status;
        this.branch = branch;
        this.atmTemperature = atmTemperature;
        this.atmCashFlow = atmCashFlow;
    }

    public List<AtmCashflow> getAtmCashFlow() {
        return atmCashFlow;
    }

    public void setAtmCashFlow(List<AtmCashflow> atmCashFlow) {
        this.atmCashFlow = atmCashFlow;
    }

    public int getAtmId() {
        return atmId;
    }

    public void setAtmId(int atmId) {
        this.atmId = atmId;
    }

    public String getAtmCode() {
        return atmCode;
    }

    public void setAtmCode(String atmCode) {
        this.atmCode = atmCode;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Branch getBranch() {
        return branch;
    }

    public void setBranch(Branch branch) {
        this.branch = branch;
    }

    public Atm() {
    }

}