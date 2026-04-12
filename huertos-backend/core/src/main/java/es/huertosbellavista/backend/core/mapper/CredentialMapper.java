package es.huertosbellavista.backend.core.mapper;

import es.huertosbellavista.backend.core.dto.UpdateCredentialDto;
import es.huertosbellavista.backend.core.model.Credential;
import net.miarma.backlib.dto.CreateCredentialDto;
import net.miarma.backlib.dto.CredentialDto;

public class CredentialMapper {

    public static CredentialDto toDto(Credential c) {
        if (c == null) return null;

        return new CredentialDto(
                c.getCredentialId(),
                c.getUserId(),
                c.getServiceId(),
                c.getUsername(),
                c.getEmail(),
                c.getStatus(),
                c.getCreatedAt(),
                c.getUpdatedAt()
        );
    }

    public static CreateCredentialDto toCreateDto(Credential c) {
        if (c == null) return null;

        return new CreateCredentialDto(
                c.getUserId(),
                c.getServiceId(),
                c.getUsername(),
                c.getEmail(),
                c.getPassword(),
                c.getStatus()
        );
    }

    public static Credential toEntity(CredentialDto dto) {
        if (dto == null) return null;

        Credential c = new Credential();
        c.setCredentialId(dto.getCredentialId());
        c.setUserId(dto.getUserId());
        c.setServiceId(dto.getServiceId());
        c.setUsername(dto.getUsername());
        c.setEmail(dto.getEmail());
        c.setStatus(dto.getStatus());
        c.setCreatedAt(dto.getCreatedAt());
        c.setUpdatedAt(dto.getUpdatedAt());
        return c;
    }

    public static Credential toEntity(CreateCredentialDto dto) {
        if (dto == null) return null;

        Credential c = new Credential();
        c.setUserId(dto.getUserId());
        c.setServiceId(dto.getServiceId());
        c.setUsername(dto.getUsername());
        c.setEmail(dto.getEmail());
        c.setPassword(dto.getPassword());
        c.setStatus(dto.getStatus());

        return c;
    }

    public static Credential toEntity(UpdateCredentialDto dto) {
        if (dto == null) return null;

        Credential c = new Credential();
        c.setEmail(dto.getEmail());
        c.setUsername(dto.getUsername());
        c.setStatus(dto.getStatus());

        return c;
    }

}
