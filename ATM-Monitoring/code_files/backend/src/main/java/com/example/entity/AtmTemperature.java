package com.example.entity;

import com.google.gson.Gson;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "atm_temperature")
public class AtmTemperature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "temp_id")
    private int tempId;

    @Column(name = "temperature", nullable = false)
    private double temperature;

    @Column(name = "recorded_at", nullable = false)
    private String recordedAt;

    @OneToOne
    @JoinColumn(name = "atm_id", nullable = false)
    private Atm atm;

    @Transient
    private String type;

    public String serialize() {
        return new Gson().toJson(this);
    }

}