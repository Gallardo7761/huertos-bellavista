package es.huertosbellavista.backend.huertos.mapper;

import es.huertosbellavista.backend.huertos.dto.RequestWithMetadataDto;
import es.huertosbellavista.backend.huertos.model.Request;

public class RequestWithMetadataMapper {
    public static RequestWithMetadataDto toDto(Request r) {
        if (r == null) return null;
        return new RequestWithMetadataDto(
                r.getRequestId(),
                r.getUserId(),
                r.getName(),
                r.getType(),
                r.getStatus(),
                r.getCreatedAt(),
                RequestMetadataMapper.toDto(r.getMetadata())
        );
    }
}
