package com.example.service;

import com.example.dto.AtmCashFlowRequest;
import com.example.dto.AtmDetailsRequest;
import com.example.dto.AtmTempRequest;
import com.example.entity.Atm;
import com.example.entity.AtmTemperature;
import com.example.repository.AtmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AtmDetailsService {

    @Autowired
    private AtmRepository atmRepository;

    public AtmDetailsRequest getAtmDetails(int atmId) {
        Atm atm = atmRepository.findById(atmId).orElseThrow(() -> new RuntimeException("ATM not found"));

        List<AtmTemperature> temperatures = atm.getAtmTemperature();
        AtmTempRequest atmTempRequest = null;

        if (!temperatures.isEmpty()) {
            AtmTemperature latestTemp = temperatures.get(temperatures.size() - 1);
            atmTempRequest = new AtmTempRequest(
                    latestTemp.getTempId(),
                    latestTemp.getTemperature(),
                    latestTemp.getRecordedAt()
            );
        }
        List<AtmCashFlowRequest> atmCashFlows = atm.getAtmCashFlow().stream().map(cashflow
                -> new AtmCashFlowRequest(
                        cashflow.getCashFlowId(),
                        cashflow.getCash100(),
                        cashflow.getCash200(),
                        cashflow.getCash500(),
                        cashflow.getUpdatedAt()
                )
        ).collect(Collectors.toList());

        return new AtmDetailsRequest(atm.getAtmId(), atm.getStatus(), atm.getBranch().getBranchId(), atm.getAtmCode(), atmTempRequest, atmCashFlows);
    }

}
