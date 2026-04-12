package es.huertosbellavista.backend.huertos.service.view;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import net.miarma.backlib.exception.NotFoundException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import es.huertosbellavista.backend.huertos.model.view.VIncomesWithInfo;
import es.huertosbellavista.backend.huertos.repository.view.VIncomesWithInfoRepository;
import net.miarma.backlib.util.UuidUtil;

@Service
@Transactional
public class VIncomesWithInfoService {

    private final VIncomesWithInfoRepository repository;

    public VIncomesWithInfoService(VIncomesWithInfoRepository repository) {
        this.repository = repository;
    }

    public List<VIncomesWithInfo> getAll() {
        return repository.findAll().stream()
            .sorted(Comparator.comparing(VIncomesWithInfo::getCreatedAt).reversed())
            .toList();
    }

    public VIncomesWithInfo getById(UUID incomeId) {
        byte[] idBytes = UuidUtil.uuidToBin(incomeId);
        return repository.findById(idBytes)
                .orElseThrow(() -> new NotFoundException("Ingreso no encontrado"));
    }

    public List<VIncomesWithInfo> getByUserId(UUID userId) {
        byte[] idBytes = UuidUtil.uuidToBin(userId);
        return repository.findAll().stream()
                .filter(i -> i.getUserId().equals(userId))
                .toList();
    }
}
