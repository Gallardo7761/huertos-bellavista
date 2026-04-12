package es.huertosbellavista.backend.huertos.mapper;

import es.huertosbellavista.backend.huertos.dto.UserMetadataDto;
import es.huertosbellavista.backend.huertos.model.UserMetadata;

public class UserMetadataMapper {

    public static UserMetadataDto toDto(UserMetadata entity) {
        UserMetadataDto dto = new UserMetadataDto();
        dto.setUserId(entity.getUserId());
        dto.setMemberNumber(entity.getMemberNumber());
        dto.setPlotNumber(entity.getPlotNumber());
        dto.setDni(entity.getDni());
        dto.setPhone(entity.getPhone());
        dto.setType(entity.getType());
        dto.setRole(entity.getRole());
        dto.setNotes(entity.getNotes());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setAssignedAt(entity.getAssignedAt());
        dto.setDeactivatedAt(entity.getDeactivatedAt());
        return dto;
    }

    public static UserMetadata fromDto(UserMetadataDto dto) {
        UserMetadata entity = new UserMetadata();
        entity.setUserId(dto.getUserId());
        entity.setMemberNumber(dto.getMemberNumber());
        entity.setPlotNumber(dto.getPlotNumber());
        entity.setDni(dto.getDni());
        entity.setPhone(dto.getPhone());
        entity.setType(dto.getType());
        entity.setRole(dto.getRole());
        entity.setNotes(dto.getNotes());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setAssignedAt(dto.getAssignedAt());
        entity.setDeactivatedAt(dto.getDeactivatedAt());
        return entity;
    }
}
