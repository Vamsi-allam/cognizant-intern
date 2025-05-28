package com.example.entity;

import com.google.gson.Gson;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "atm_cashflow")
public class AtmCashflow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cashflow_id")
    private int cashFlowId;

    @Column(name = "cash100")
    private int cash100;

    @Column(name = "cash200")
    private int cash200;

    @Column(name = "cash500")
    private int cash500;

    @Column(name = "updated_at", nullable = false)
    private String updatedAt;

    @ManyToOne
    @JoinColumn(name = "atm_id", nullable = false)
    private Atm atm;
    
    @Transient
    private String type;

    public String serialize() {
        return new Gson().toJson(this);
    }
}
