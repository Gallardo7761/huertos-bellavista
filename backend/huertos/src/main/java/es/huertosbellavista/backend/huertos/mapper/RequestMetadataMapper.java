package es.huertosbellavista.backend.huertos.mapper;

import es.huertosbellavista.backend.huertos.dto.RequestMetadataDto;
import es.huertosbellavista.backend.huertos.model.RequestMetadata;

public class RequestMetadataMapper {

    public static RequestMetadata fromDto(RequestMetadataDto dto) {
        if (dto == null) return null;

        RequestMetadata metadata = new RequestMetadata();

        metadata.setDisplayName(dto.displayName());
        metadata.setDni(dto.dni());
        metadata.setPhone(dto.phone());
        metadata.setEmail(dto.email());

        metadata.setUsername(dto.username());
        metadata.setAddress(dto.address());
        metadata.setZipCode(dto.zipCode());
        metadata.setCity(dto.city());

        metadata.setMemberNumber(dto.memberNumber());
        metadata.setPlotNumber(dto.plotNumber());

        metadata.setType(dto.type());

        return metadata;
    }

    public static RequestMetadataDto toDto(RequestMetadata entity) {
        if (entity == null) return null;

        return new RequestMetadataDto(
                entity.getId(),
                entity.getDisplayName(),
                entity.getDni(),
                entity.getPhone(),
                entity.getEmail(),
                entity.getUsername(),
                entity.getAddress(),
                entity.getZipCode(),
                entity.getCity(),
                entity.getMemberNumber(),
                entity.getPlotNumber(),
                entity.getType(),
                entity.getCreatedAt()
        );
    }
}
