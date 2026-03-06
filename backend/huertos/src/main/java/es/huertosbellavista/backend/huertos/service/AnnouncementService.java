package es.huertosbellavista.backend.huertos.service;

import jakarta.transaction.Transactional;
import es.huertosbellavista.backend.huertos.model.Announcement;
import es.huertosbellavista.backend.huertos.repository.AnnouncementRepository;
import net.miarma.backlib.exception.NotFoundException;
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
    private final MemberService memberService;

    public AnnouncementService(AnnouncementRepository announcementRepository, MemberService memberService) {
        this.announcementRepository = announcementRepository;
        this.memberService = memberService;
    }

    public List<Announcement> getAll() {
        return announcementRepository.findAll().stream()
            .sorted(Comparator.comparing(Announcement::getCreatedAt).reversed())
            .toList();
    }

    public Announcement getById(UUID announceId) {
        byte[] idBytes = UuidUtil.uuidToBin(announceId);
        return announcementRepository.findById(idBytes)
                .orElseThrow(() -> new NotFoundException("Anuncio no encontrado"));
    }

    public Announcement create(Announcement announcement) {
        if (announcement.getAnnounceId() == null) {
            announcement.setAnnounceId(UUID.randomUUID());
        }
        announcement.setPublishedByName(memberService.getById(announcement.getPublishedBy()).user().getDisplayName());
        announcement.setCreatedAt(Instant.now());
        return announcementRepository.save(announcement);
    }

    public Announcement update(UUID announceId, Announcement changes) {
        Announcement announcement = getById(announceId);

        if (changes.getBody() != null)
            announcement.setBody(changes.getBody());

        if (changes.getPriority() != null)
            announcement.setPriority(changes.getPriority());

        if (changes.getPublishedBy() != null)
            announcement.setPublishedBy(changes.getPublishedBy());

        return announcementRepository.save(announcement);
    }

    public void delete(UUID announceId) {
        byte[] idBytes = UuidUtil.uuidToBin(announceId);
        if (!announcementRepository.existsById(idBytes))
            throw new NotFoundException("Anuncio no encontrado");
        announcementRepository.deleteById(idBytes);
    }
}
