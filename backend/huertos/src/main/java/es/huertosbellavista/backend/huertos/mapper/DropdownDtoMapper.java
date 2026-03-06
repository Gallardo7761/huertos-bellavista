package es.huertosbellavista.backend.huertos.mapper;

import es.huertosbellavista.backend.huertos.dto.DropdownDto;
import es.huertosbellavista.backend.huertos.dto.MemberDto;

public class DropdownDtoMapper {
    public static DropdownDto toDto(MemberDto dto) {
        return new DropdownDto(dto.user().getUserId(), dto.metadata().getMemberNumber(), dto.user().getDisplayName());
    }
}
