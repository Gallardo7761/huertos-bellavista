package es.huertosbellavista.backend.huertos.dto;

import java.util.UUID;

public record DropdownDto(UUID userId, Integer memberNumber, String displayName) {
}
