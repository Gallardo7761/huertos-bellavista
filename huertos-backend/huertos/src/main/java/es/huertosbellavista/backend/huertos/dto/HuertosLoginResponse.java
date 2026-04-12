package es.huertosbellavista.backend.huertos.dto;

import net.miarma.backlib.dto.CredentialDto;
import net.miarma.backlib.dto.UserDto;

public record HuertosLoginResponse(
        String token,
        UserDto user,
        CredentialDto account,
        UserMetadataDto metadata
) {
}
