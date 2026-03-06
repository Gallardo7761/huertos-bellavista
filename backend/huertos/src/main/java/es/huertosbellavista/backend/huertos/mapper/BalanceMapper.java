package es.huertosbellavista.backend.huertos.mapper;

import es.huertosbellavista.backend.huertos.dto.BalanceDto;
import es.huertosbellavista.backend.huertos.model.Balance;

public class BalanceMapper {

    public static BalanceDto toDto(Balance balance) {
        if (balance == null) return null;

        BalanceDto dto = new BalanceDto();
        dto.setId(balance.getId());
        dto.setInitialBank(balance.getInitialBank());
        dto.setInitialCash(balance.getInitialCash());
        dto.setCreatedAt(balance.getCreatedAt());
        return dto;
    }

    public static Balance toEntity(BalanceDto dto) {
        if (dto == null) return null;

        Balance balance = new Balance();
        balance.setId(dto.getId());
        balance.setInitialBank(dto.getInitialBank());
        balance.setInitialCash(dto.getInitialCash());
        balance.setCreatedAt(dto.getCreatedAt());
        return balance;
    }
}
