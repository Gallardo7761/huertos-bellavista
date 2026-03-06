package es.huertosbellavista.backend.huertos.mapper;

import es.huertosbellavista.backend.huertos.dto.IncomeDto;
import es.huertosbellavista.backend.huertos.model.Income;

public class IncomeMapper {

    public static IncomeDto.Response toResponse(Income entity) {
        if (entity == null) return null;

        IncomeDto.Response dto = new IncomeDto.Response();
        dto.setIncomeId(entity.getIncomeId());
        dto.setUserId(entity.getUserId());
        dto.setConcept(entity.getConcept());
        dto.setAmount(entity.getAmount());
        dto.setType(entity.getType());
        dto.setFrequency(entity.getFrequency());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    public static Income toEntity(IncomeDto.Request dto) {
        if (dto == null) return null;

        Income entity = new Income();
        entity.setUserId(dto.getUserId());
        entity.setConcept(dto.getConcept());
        entity.setAmount(dto.getAmount());
        entity.setType(dto.getType());
        entity.setFrequency(dto.getFrequency());
        entity.setCreatedAt(dto.getCreatedAt());
        return entity;
    }
}
