package es.huertosbellavista.backend.huertos.service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import es.huertosbellavista.backend.huertos.model.view.VIncomesWithInfo;
import es.huertosbellavista.backend.huertos.service.view.VIncomesWithInfoService;
import net.miarma.backlib.exception.BadRequestException;
import net.miarma.backlib.exception.NotFoundException;
import net.miarma.backlib.exception.ValidationException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import es.huertosbellavista.backend.huertos.model.Income;
import es.huertosbellavista.backend.huertos.repository.IncomeRepository;
import net.miarma.backlib.util.UuidUtil;

@Service
@Transactional
public class IncomeService {

    private final IncomeRepository incomeRepository;
    private final VIncomesWithInfoService incomesWithInfoService;
    private final UserMetadataService metadataService;

    public IncomeService(IncomeRepository incomeRepository,
                         VIncomesWithInfoService incomesWithInfoService,
                         UserMetadataService metadataService) {
        this.incomeRepository = incomeRepository;
        this.incomesWithInfoService = incomesWithInfoService;
        this.metadataService = metadataService;
    }

    public List<Income> getAll() {
        return incomeRepository.findAll().stream()
            .sorted(Comparator.comparing(Income::getCreatedAt).reversed())
            .toList();
    }

    public Income getById(UUID incomeId) {
        byte[] idBytes = UuidUtil.uuidToBin(incomeId);
        return incomeRepository.findById(idBytes)
                .orElseThrow(() -> new NotFoundException("Ingreso no encontrado"));
    }

    public List<Income> getByUserId(UUID userId) {
        return incomeRepository.findAll().stream()
                .filter(i -> i.getUserId().equals(userId))
                .toList();
    }

    public Income create(Income income) {
        if (income.getUserId() == null) {
            throw new BadRequestException("El identificador de usuario es obligatorio");
        }
        if (income.getConcept() == null) {
            throw new BadRequestException("El concepto es obligatorio");
        }
        if (income.getConcept().isBlank() || income.getConcept().isEmpty()) {
            throw new ValidationException("concept", "El concepto no puede ir vacío");
        }
        if (income.getAmount() == null || income.getAmount().signum() <= 0) {
            throw new ValidationException("amount", "La cantidad debe ser positiva");
        }
        if (income.getCreatedAt() == null) {
            income.setCreatedAt(Instant.now());
        }

        income.setIncomeId(UUID.randomUUID());

        return incomeRepository.save(income);
    }

    public Income update(UUID incomeId, Income changes) {
        byte[] idBytes = UuidUtil.uuidToBin(incomeId);

        Income income = incomeRepository.findById(idBytes)
                .orElseThrow(() -> new NotFoundException("Ingreso no encontrado"));

        if (changes.getConcept() != null) income.setConcept(changes.getConcept());
        if (changes.getAmount() != null) {
            if (changes.getAmount().signum() <= 0) {
                throw new ValidationException("amount", "La cantidad debe ser positiva");
            }
            income.setAmount(changes.getAmount());
        }
        if (changes.getType() != null) income.setType(changes.getType());
        if (changes.getFrequency() != null) income.setFrequency(changes.getFrequency());
        if (changes.getCreatedAt() != null && !changes.getCreatedAt().equals(income.getCreatedAt())) {
            income.setCreatedAt(changes.getCreatedAt());
        }
        
        return incomeRepository.save(income);
    }

    public void delete(UUID incomeId) {
        byte[] idBytes = UuidUtil.uuidToBin(incomeId);

        if (!incomeRepository.existsById(idBytes)) {
            throw new NotFoundException("Ingreso no encontrado");
        }

        incomeRepository.deleteById(idBytes);
    }

    public Boolean existsByMemberNumber(Integer memberNumber) {
        try {
            UUID userId = metadataService.getByMemberNumber(memberNumber).getUserId();
            return !getByUserId(userId).isEmpty();
        } catch (Exception e) {
            return false;
        }
    }

    public Boolean hasPaid(Integer memberNumber) {
        UUID userId = metadataService.getByMemberNumber(memberNumber).getUserId();
        List<Income> incomes = getByUserId(userId);
        return !incomes.isEmpty() && incomes.stream().allMatch(Income::isPaid);
    }

    public List<VIncomesWithInfo> getByMemberNumber(Integer memberNumber) {
        UUID userId = metadataService.getByMemberNumber(memberNumber).getUserId();
        return incomesWithInfoService.getByUserId(userId);
    }
}
