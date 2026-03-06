package es.huertosbellavista.backend.huertos.mapper.view;

import es.huertosbellavista.backend.huertos.dto.view.VIncomesWithInfoDto;
import es.huertosbellavista.backend.huertos.model.view.VIncomesWithInfo;

public class VIncomesWithInfoMapper {

    public static VIncomesWithInfoDto toResponse(VIncomesWithInfo entity) {
        VIncomesWithInfoDto dto = new VIncomesWithInfoDto();
        dto.setIncomeId(entity.getIncomeId());
        dto.setUserId(entity.getUserId());
        dto.setDisplayName(entity.getDisplayName());
        dto.setMemberNumber(entity.getMemberNumber());
        dto.setConcept(entity.getConcept());
        dto.setAmount(entity.getAmount());
        dto.setType(entity.getType());
        dto.setFrequency(entity.getFrequency());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}
