package es.huertosbellavista.backend.huertos.mapper.view;

import es.huertosbellavista.backend.huertos.dto.view.VAnnouncementsWithPublishersDto;
import es.huertosbellavista.backend.huertos.model.view.VAnnouncementsWithPublishers;

public class VAnnouncementsWithPublishersMapper {
    public static VAnnouncementsWithPublishersDto toDto(VAnnouncementsWithPublishers entity) {
        VAnnouncementsWithPublishersDto dto = new VAnnouncementsWithPublishersDto();
        dto.setAnnouncementId(entity.getAnnouncementId());
        dto.setTitle(entity.getTitle());
        dto.setBody(entity.getBody());
        dto.setPriority(entity.getPriority());
        dto.setPublishedBy(entity.getPublishedBy());
        dto.setPublisherPosition(entity.getPublisherPosition());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}
