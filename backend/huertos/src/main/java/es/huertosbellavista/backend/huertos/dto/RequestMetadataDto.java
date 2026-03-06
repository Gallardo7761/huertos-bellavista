package es.huertosbellavista.backend.huertos.dto;

import java.time.Instant;

public record RequestMetadataDto(
        Long id,
        String displayName,
        String dni,
        String phone,
        String email,
        String username,
        String address,
        String zipCode,
        String city,
        Integer memberNumber,
        Integer plotNumber,
        Byte type,
        Instant createdAt
) {}

