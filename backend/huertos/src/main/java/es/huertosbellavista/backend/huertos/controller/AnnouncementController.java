package es.huertosbellavista.backend.huertos.controller;

import es.huertosbellavista.backend.huertos.dto.AnnouncementDto;
import es.huertosbellavista.backend.huertos.mapper.AnnouncementMapper;
import es.huertosbellavista.backend.huertos.model.Announcement;
import es.huertosbellavista.backend.huertos.service.AnnouncementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/announcements")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @GetMapping
    public ResponseEntity<List<AnnouncementDto.Response>> getAll() {
        return ResponseEntity.ok(
                announcementService.getAll()
                        .stream()
                        .map(AnnouncementMapper::toResponse)
                        .toList()
        );
    }

    @GetMapping("/{announce_id}")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<AnnouncementDto.Response> getById(@PathVariable("announce_id") UUID announcementId) {
        Announcement announcement = announcementService.getById(announcementId);
        return ResponseEntity.ok(AnnouncementMapper.toResponse(announcement));
    }

    @PutMapping("/{announce_id}")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<AnnouncementDto.Response> update(
            @PathVariable("announce_id") UUID announcementId,
            @RequestBody AnnouncementDto.Request dto
    ) {
        return ResponseEntity.ok(
            AnnouncementMapper.toResponse(announcementService.update(announcementId, AnnouncementMapper.toEntity(dto)))
        );
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<AnnouncementDto.Response> create(@RequestBody AnnouncementDto.Request dto) {
        return ResponseEntity.ok(
            AnnouncementMapper.toResponse(
                announcementService.create(
                    AnnouncementMapper.toEntity(dto)
                )));
    }

    @DeleteMapping("/{announce_id}")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<Map<String, String>> delete(@PathVariable("announce_id") UUID announcementId) {
        announcementService.delete(announcementId);
        return ResponseEntity.ok(Map.of("message", "Deleted announcement: " + announcementId));
    }
}
