package es.huertosbellavista.backend.huertos.controller;

import es.huertosbellavista.backend.huertos.dto.AnnouncementDto;
import es.huertosbellavista.backend.huertos.dto.view.VAnnouncementsWithPublishersDto;
import es.huertosbellavista.backend.huertos.mapper.AnnouncementMapper;
import es.huertosbellavista.backend.huertos.mapper.view.VAnnouncementsWithPublishersMapper;
import es.huertosbellavista.backend.huertos.model.Announcement;
import es.huertosbellavista.backend.huertos.model.view.VAnnouncementsWithPublishers;
import es.huertosbellavista.backend.huertos.service.AnnouncementService;
import es.huertosbellavista.backend.huertos.service.view.VAnnouncementsWithPublishersService;
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
    private final VAnnouncementsWithPublishersService vAnnouncementsWithPublishersService;

    public AnnouncementController(AnnouncementService announcementService,
                                  VAnnouncementsWithPublishersService vAnnouncementsWithPublishersService) {
        this.announcementService = announcementService;
        this.vAnnouncementsWithPublishersService = vAnnouncementsWithPublishersService;
    }

    @GetMapping
    public ResponseEntity<List<VAnnouncementsWithPublishersDto>> getAll() {
        return ResponseEntity.ok(
            vAnnouncementsWithPublishersService.getAll()
                .stream()
                .map(VAnnouncementsWithPublishersMapper::toDto)
                .toList()
        );
    }

    @GetMapping("/{announcement_id}")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<VAnnouncementsWithPublishersDto> getById(@PathVariable("announcement_id") UUID announcementId) {
        VAnnouncementsWithPublishers announcement = vAnnouncementsWithPublishersService.getById(announcementId);
        return ResponseEntity.ok(VAnnouncementsWithPublishersMapper.toDto(announcement));
    }

    @PutMapping("/{announcement_id}")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<AnnouncementDto.Response> update(
            @PathVariable("announcement_id") UUID announcementId,
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

    @DeleteMapping("/{announcement_id}")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<Map<String, String>> delete(@PathVariable("announcement_id") UUID announcementId) {
        announcementService.delete(announcementId);
        return ResponseEntity.ok(Map.of("message", "Deleted announcement: " + announcementId));
    }
}
