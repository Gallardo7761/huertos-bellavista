package es.huertosbellavista.backend.huertos.dto;

import java.time.Instant;
import java.util.UUID;

public record RequestWithMetadataDto(
        UUID requestId,
        UUID userId,
        String name,
        Byte type,
        Byte status,
        Instant createdAt,
        RequestMetadataDto metadata
) {}

