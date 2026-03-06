package es.huertosbellavista.backend.huertos.mapper.view;

import es.huertosbellavista.backend.huertos.dto.view.VBalanceWithTotalsDto;
import es.huertosbellavista.backend.huertos.model.view.VBalanceWithTotals;

public class VBalanceWithTotalsMapper {

    public static VBalanceWithTotalsDto toDto(VBalanceWithTotals entity) {
        VBalanceWithTotalsDto dto = new VBalanceWithTotalsDto();
        dto.setId(entity.getId());
        dto.setInitialBank(entity.getInitialBank());
        dto.setInitialCash(entity.getInitialCash());
        dto.setTotalBankExpenses(entity.getTotalBankExpenses());
        dto.setTotalCashExpenses(entity.getTotalCashExpenses());
        dto.setTotalBankIncomes(entity.getTotalBankIncomes());
        dto.setTotalCashIncomes(entity.getTotalCashIncomes());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}
