package es.huertosbellavista.backend.huertos.controller;

import es.huertosbellavista.backend.huertos.dto.RequestCountDto;
import es.huertosbellavista.backend.huertos.dto.RequestDto;
import es.huertosbellavista.backend.huertos.dto.RequestWithMetadataDto;
import es.huertosbellavista.backend.huertos.dto.*;
import es.huertosbellavista.backend.huertos.mapper.RequestMapper;
import es.huertosbellavista.backend.huertos.mapper.RequestWithMetadataMapper;
import es.huertosbellavista.backend.huertos.model.Request;
import es.huertosbellavista.backend.huertos.service.RequestAcceptanceService;
import es.huertosbellavista.backend.huertos.service.RequestService;
import net.miarma.backlib.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/requests")
public class RequestController {

    private final RequestService requestService;
    private final RequestAcceptanceService requestAcceptanceService;
    private final JwtService jwtService;

    public RequestController(RequestService requestService,
                             RequestAcceptanceService requestAcceptanceService,
                             JwtService jwtService) {
        this.requestService = requestService;
        this.requestAcceptanceService = requestAcceptanceService;
        this.jwtService = jwtService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<List<RequestDto.Response>> getAll() {
        return ResponseEntity.ok(
                requestService.getAll()
                        .stream()
                        .map(RequestMapper::toResponse)
                        .toList()
        );
    }

    @PostMapping
    public ResponseEntity<RequestDto.Response> create(@RequestBody RequestDto.Request dto) {
        return ResponseEntity.ok(
            RequestMapper.toResponse(
                requestService.create(
                    RequestMapper.toEntity(dto)
                )));
    }

    @GetMapping("/count")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<RequestCountDto> getRequestCount() {
        return ResponseEntity.ok(
            requestService.getAll()
                .stream()
                .map(RequestMapper::toResponse)
                .collect(Collectors.collectingAndThen(
                    Collectors.counting(),
                    RequestCountDto::new
                ))
        );
    }

    @GetMapping("/mine")
    public ResponseEntity<List<RequestDto.Response>> getMine(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7);

        UUID userId;
        try {
            userId = jwtService.getUserId(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(
            requestService.getByUserId(userId)
                .stream()
                .map(RequestMapper::toResponse)
                .toList()
        );
    }

    @GetMapping("/full")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<List<RequestWithMetadataDto>> getAllWithMetadata() {
        return ResponseEntity.ok(
            requestService.getAll()
                .stream()
                .map(RequestWithMetadataMapper::toDto)
                .toList()
        );
    }

    @GetMapping("/full/{request_id}")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<RequestWithMetadataDto> getByIdWithMetadata(
            @PathVariable("request_id") UUID requestId) {
        Request request = requestService.getById(requestId);
        return ResponseEntity.ok(RequestWithMetadataMapper.toDto(request));
    }

    @GetMapping("/{request_id}")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<RequestDto.Response> getById(@PathVariable("request_id") UUID requestId) {
        Request request = requestService.getById(requestId);
        return ResponseEntity.ok(RequestMapper.toResponse(request));
    }

    @PutMapping("/{request_id}")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<RequestDto.Response> update(
            @PathVariable("request_id") UUID requestId,
            @RequestBody RequestDto.Request dto
    ) {
        return ResponseEntity.ok(
            RequestMapper.toResponse(requestService.update(requestId, RequestMapper.toEntity(dto)))
        );
    }

    @PutMapping("/{request_id}/accept")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<Map<String, String>> acceptRequest(@PathVariable("request_id") UUID requestId) {
        Request r = requestAcceptanceService.acceptRequest(requestId);
        requestAcceptanceService.handleSideEffects(r);
        return ResponseEntity.ok(Map.of("message", "Accepted request: " + r.getRequestId()));
    }

    @PutMapping("/{request_id}/reject")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<Map<String, String>> rejectRequest(@PathVariable("request_id") UUID requestId) {
        Request r = requestService.reject(requestId);
        return ResponseEntity.ok(Map.of("message", "Denied request: " + r.getRequestId()));
    }

    @DeleteMapping("/{request_id}")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<Map<String, String>> delete(@PathVariable("request_id") UUID requestId) {
        requestService.delete(requestId);
        return ResponseEntity.ok(Map.of("message", "Deleted request: " + requestId));
    }
}
