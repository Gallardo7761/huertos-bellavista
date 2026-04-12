package es.huertosbellavista.backend.huertos.dto;

import es.huertosbellavista.backend.huertos.dto.view.VIncomesWithInfoDto;
import net.miarma.backlib.dto.CredentialDto;
import net.miarma.backlib.dto.UserDto;

import java.util.List;

public record MemberProfileDto(
        UserDto user,
        CredentialDto account,
        UserMetadataDto metadata,
        List<RequestDto.Response> requests,
        List<VIncomesWithInfoDto> payments,
        boolean hasCollaborator,
        boolean hasGreenhouse,
        boolean hasCollaboratorRequest,
        boolean hasGreenhouseRequest
) {
}
