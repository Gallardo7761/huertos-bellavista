package es.huertosbellavista.backend.huertos.service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.List;

import es.huertosbellavista.backend.huertos.dto.view.VBalanceWithTotalsDto;
import es.huertosbellavista.backend.huertos.mapper.view.VBalanceWithTotalsMapper;
import es.huertosbellavista.backend.huertos.model.Expense;
import es.huertosbellavista.backend.huertos.model.Income;
import es.huertosbellavista.backend.huertos.model.view.VBalanceWithTotals;
import es.huertosbellavista.backend.huertos.repository.view.VBalanceWithTotalsRepository;
import es.huertosbellavista.backend.huertos.service.view.VBalanceWithTotalsService;
import net.miarma.backlib.exception.ConflictException;
import net.miarma.backlib.exception.NotFoundException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import es.huertosbellavista.backend.huertos.model.Balance;
import es.huertosbellavista.backend.huertos.repository.BalanceRepository;

@Service
@Transactional
public class BalanceService {

    private final BalanceRepository balanceRepository;
    private final VBalanceWithTotalsService vBalanceWithTotalsService;

    public BalanceService(BalanceRepository balanceRepository,
                          VBalanceWithTotalsService vBalanceWithTotalsService,
                          IncomeService incomeService,
                          ExpenseService expenseService) {
        this.balanceRepository = balanceRepository;
        this.vBalanceWithTotalsService = vBalanceWithTotalsService;
    }

    public Balance get(short year) {
        return balanceRepository.findById(year)
                .orElseThrow(() -> new NotFoundException("Balance inicial no configurado para el año " + year));
    }

    public VBalanceWithTotalsDto getWithTotals(short year) {
        return VBalanceWithTotalsMapper.toDto(vBalanceWithTotalsService.getByYear(year));
    }

    public List<Short> getAvailableYears() {
        return balanceRepository.findAll().stream()
                .map(Balance::getYear)
                .sorted(Comparator.reverseOrder())
                .toList();
    }

    public Balance create(Balance balance) {
        if (balanceRepository.existsById(balance.getYear())) {
            throw new ConflictException("Ya existe el balance inicial para el año " + balance.getYear());
        }
        balance.setCreatedAt(Instant.now());
        return balanceRepository.save(balance);
    }

    public Balance update(short year, Balance dto) {
        Balance balance = balanceRepository.findById(year)
                .orElseThrow(() -> new NotFoundException("Balance no encontrado para el año " + year));

        if (dto.getInitialBank() != null) balance.setInitialBank(dto.getInitialBank());
        if (dto.getInitialCash() != null) balance.setInitialCash(dto.getInitialCash());

        return balanceRepository.save(balance);
    }

    public void delete(short year) {
        if (!balanceRepository.existsById(year)) {
            throw new NotFoundException("Balance no encontrado para el año " + year);
        }
        balanceRepository.deleteById(year);
    }
}
