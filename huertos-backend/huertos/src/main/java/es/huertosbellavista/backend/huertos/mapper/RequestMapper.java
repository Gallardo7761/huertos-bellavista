package es.huertosbellavista.backend.huertos.mapper;

import es.huertosbellavista.backend.huertos.dto.RequestDto;
import es.huertosbellavista.backend.huertos.model.Request;

public class RequestMapper {

    public static RequestDto.Response toResponse(Request entity) {
        if (entity == null) return null;

        RequestDto.Response dto = new RequestDto.Response();
        dto.setRequestId(entity.getRequestId());
        dto.setType(entity.getType());
        dto.setStatus(entity.getStatus());
        dto.setUserId(entity.getUserId());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setHash(entity.getHash());

        if (entity.getMetadata() != null) {
            dto.setMetadata(
                    RequestMetadataMapper.toDto(entity.getMetadata())
            );
        }

        return dto;
    }

    public static Request toEntity(RequestDto.Request dto) {
        if (dto == null) return null;

        Request entity = new Request();
        entity.setType(dto.getType());
        entity.setUserId(dto.getUserId());
        entity.setName(dto.getName());
        entity.setStatus((byte) 0);

        if (dto.getMetadata() != null) {
            entity.setMetadata(
                RequestMetadataMapper.fromDto(dto.getMetadata())
            );
        }

        return entity;
    }
}
