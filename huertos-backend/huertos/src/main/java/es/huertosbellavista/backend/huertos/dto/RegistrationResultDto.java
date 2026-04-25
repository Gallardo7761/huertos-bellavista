package es.huertosbellavista.backend.huertos.dto;

import net.miarma.backlib.dto.UserWithCredentialDto;

public record RegistrationResultDto(UserWithCredentialDto uwc, String rawPassword) {}
