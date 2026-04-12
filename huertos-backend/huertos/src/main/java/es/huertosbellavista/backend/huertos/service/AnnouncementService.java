package es.huertosbellavista.backend.huertos.service;

import jakarta.transaction.Transactional;
import es.huertosbellavista.backend.huertos.model.Announcement;
import es.huertosbellavista.backend.huertos.repository.AnnouncementRepository;
import net.miarma.backlib.exception.BadRequestException;
import net.miarma.backlib.exception.NotFoundException;
import net.miarma.backlib.exception.ValidationException;
import net.miarma.backlib.util.UuidUtil;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    public AnnouncementService(AnnouncementRepository announcementRepository, MemberService memberService) {
        this.announcementRepository = announcementRepository;
    }

    public List<Announcement> getAll() {
        return announcementRepository.findAll().stream()
            .sorted(Comparator.comparing(Announcement::getCreatedAt).reversed())
            .toList();
    }

    public Announcement getById(UUID announcementId) {
        byte[] idBytes = UuidUtil.uuidToBin(announcementId);
        return announcementRepository.findById(idBytes)
                .orElseThrow(() -> new NotFoundException("Anuncio no encontrado"));
    }

    public Announcement create(Announcement announcement) {
        if(announcement.getTitle().isBlank() || announcement.getTitle() == null) {
            throw new ValidationException("title", "El título no puede estar vacío");
        }

        if(announcement.getBody().isBlank() || announcement.getBody() == null) {
            throw new ValidationException("body", "El cuerpo no puede estar vacío");
        }

        if(announcement.getPriority() == null) {
            throw new BadRequestException("La prioridad es obligatoria");
        }

        if(announcement.getPublishedBy() == null) {
            throw new BadRequestException("El autor es obligatorio");
        }

        announcement.setAnnouncementId(UUID.randomUUID());
        return announcementRepository.save(announcement);
    }

    public Announcement update(UUID announcementId, Announcement changes) {
        Announcement announcement = getById(announcementId);

        if (changes.getTitle() != null)
            announcement.setTitle(changes.getTitle());

        if (changes.getBody() != null)
            announcement.setBody(changes.getBody());

        if (changes.getPriority() != null)
            announcement.setPriority(changes.getPriority());

        if (changes.getPublishedBy() != null)
            announcement.setPublishedBy(changes.getPublishedBy());

        return announcementRepository.save(announcement);
    }

    public void delete(UUID announcementId) {
        byte[] idBytes = UuidUtil.uuidToBin(announcementId);
        if (!announcementRepository.existsById(idBytes))
            throw new NotFoundException("Anuncio no encontrado");
        announcementRepository.deleteById(idBytes);
    }
}
