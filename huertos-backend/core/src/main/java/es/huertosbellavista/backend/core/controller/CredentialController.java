package es.huertosbellavista.backend.core.controller;

import java.util.List;
import java.util.UUID;

import es.huertosbellavista.backend.core.dto.UpdateCredentialDto;
import es.huertosbellavista.backend.core.dto.UpdateFullCredentialDto;
import es.huertosbellavista.backend.core.mapper.CredentialMapper;
import es.huertosbellavista.backend.core.security.CorePrincipal;
import net.miarma.backlib.dto.*;
import net.miarma.backlib.exception.ForbiddenException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import es.huertosbellavista.backend.core.model.Credential;
import es.huertosbellavista.backend.core.service.CredentialService;

@RestController
@RequestMapping("/credentials")
public class CredentialController {

    private final CredentialService credentialService;

    public CredentialController(CredentialService credentialService) {
        this.credentialService = credentialService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Credential>> getAll() {
        return ResponseEntity.ok(credentialService.getAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CredentialDto> create(@RequestBody CreateCredentialDto dto) {
        return ResponseEntity.ok(
            CredentialMapper.toDto(
                credentialService.create(
                    CredentialMapper.toEntity(dto)))
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CredentialDto>> getByUserId(@PathVariable("userId") UUID userId) {
        CorePrincipal principal = (CorePrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!principal.getRole().equals((byte)1) && !principal.getUserId().equals(userId)) {
            throw new ForbiddenException("No tienes permiso");
        }
        return ResponseEntity.ok(credentialService.getByUserId(userId).stream()
                .map(CredentialMapper::toDto)
                .toList());
    }

    @GetMapping("/{credential_id}")
    public ResponseEntity<CredentialDto> getById(@PathVariable("credential_id") UUID credentialId) {
        CorePrincipal principal = (CorePrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Credential cred = credentialService.getById(credentialId);
        if (!principal.getRole().equals((byte)1) && !cred.getUserId().equals(principal.getUserId())) {
            throw new ForbiddenException("No tienes permiso");
        }
        return ResponseEntity.ok(CredentialMapper.toDto(cred));
    }

    @PutMapping("/{credential_id}")
    public ResponseEntity<CredentialDto> update(
            @PathVariable("credential_id") UUID credentialId,
            @RequestBody UpdateCredentialDto dto
    ) {
        CorePrincipal principal = (CorePrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Credential cred = credentialService.getById(credentialId);
        if (!principal.getRole().equals((byte)1) && !cred.getUserId().equals(principal.getUserId())) {
            throw new ForbiddenException("No tienes permiso");
        }
        return ResponseEntity.ok(
                CredentialMapper.toDto(
                    credentialService.update(credentialId, CredentialMapper.toEntity(dto))
                )
        );
    }

    @PutMapping("/{credential_id}/full")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CredentialDto> updateFull(
            @PathVariable("credential_id") UUID credentialId,
            @RequestBody UpdateFullCredentialDto dto
    ) {
        return ResponseEntity.ok(
            CredentialMapper.toDto(
                credentialService.update(credentialId, CredentialMapper.toEntity(dto))
            )
        );
    }

    @GetMapping("/{service_id}/{user_id}/status")
    public ResponseEntity<Byte> getStatus(@PathVariable("user_id") UUID userId, @PathVariable("service_id") Byte serviceId) {
        return ResponseEntity.ok(credentialService.getStatus(userId, serviceId));
    }
}
