package es.huertosbellavista.backend.huertos.service.view;

import es.huertosbellavista.backend.huertos.model.view.VAnnouncementsWithPublishers;
import es.huertosbellavista.backend.huertos.model.view.VIncomesWithInfo;
import es.huertosbellavista.backend.huertos.repository.view.VAnnouncementsWithPublishersRepository;
import es.huertosbellavista.backend.huertos.repository.view.VIncomesWithInfoRepository;
import jakarta.transaction.Transactional;
import net.miarma.backlib.exception.NotFoundException;
import net.miarma.backlib.util.UuidUtil;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class VAnnouncementsWithPublishersService {
    private final VAnnouncementsWithPublishersRepository repository;

    public VAnnouncementsWithPublishersService(VAnnouncementsWithPublishersRepository repository) {
        this.repository = repository;
    }

    public List<VAnnouncementsWithPublishers> getAll() {
        return repository.findAll().stream()
                .sorted(Comparator.comparing(VAnnouncementsWithPublishers::getCreatedAt).reversed())
                .toList();
    }

    public VAnnouncementsWithPublishers getById(UUID announcementId) {
        byte[] idBytes = UuidUtil.uuidToBin(announcementId);
        return repository.findById(idBytes)
                .orElseThrow(() -> new NotFoundException("Anuncio no encontrado"));
    }
}
