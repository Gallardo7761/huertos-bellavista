package es.huertosbellavista.backend.huertos.mapper;

import es.huertosbellavista.backend.huertos.dto.AnnouncementDto;
import es.huertosbellavista.backend.huertos.model.Announcement;

import java.time.Instant;
import java.util.UUID;

public class AnnouncementMapper {

    public static AnnouncementDto.Response toResponse(Announcement entity) {
        AnnouncementDto.Response dto = new AnnouncementDto.Response();
        dto.setAnnounceId(entity.getAnnounceId());
        dto.setBody(entity.getBody());
        dto.setPriority(entity.getPriority());
        dto.setPublishedBy(entity.getPublishedBy());
        dto.setPublishedByName(entity.getPublishedByName());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    public static Announcement toEntity(AnnouncementDto.Request dto) {
        Announcement entity = new Announcement();
        entity.setAnnounceId(UUID.randomUUID());
        entity.setBody(dto.getBody());
        entity.setPriority(dto.getPriority());
        entity.setPublishedBy(dto.getPublishedBy());
        entity.setCreatedAt(Instant.now());
        return entity;
    }
}
