package es.huertosbellavista.backend.huertos.service;

import java.time.Instant;

import es.huertosbellavista.backend.huertos.model.view.VBalanceWithTotals;
import es.huertosbellavista.backend.huertos.repository.view.VBalanceWithTotalsRepository;
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
    private final VBalanceWithTotalsRepository vBalanceWithTotalsRepository;

    public BalanceService(BalanceRepository balanceRepository, VBalanceWithTotalsRepository vBalanceWithTotalsRepository) {
        this.balanceRepository = balanceRepository;
        this.vBalanceWithTotalsRepository = vBalanceWithTotalsRepository;
    }

    public Balance get() {
        return balanceRepository.findById((byte) 1)
                .orElseThrow(() -> new NotFoundException("Balance no encontrado"));
    }

    public VBalanceWithTotals getWithTotals() {
        return vBalanceWithTotalsRepository.findById((byte) 1)
                .orElseThrow(() -> new NotFoundException("Balance no encontrado"));
    }

    public Balance create(Balance balance) {
        if (balanceRepository.existsById((byte) 1)) {
            throw new ConflictException("Ya hay un valor de balance en la base de datos");
        }
        balance.setId((byte) 1);
        balance.setCreatedAt(Instant.now());
        return balanceRepository.save(balance);
    }

    public Balance update(Balance dto) {
        Balance balance = balanceRepository.findById((byte) 1)
                .orElseThrow(() -> new NotFoundException("Balance no encontrado"));

        if (dto.getInitialBank() != null) balance.setInitialBank(dto.getInitialBank());
        if (dto.getInitialCash() != null) balance.setInitialCash(dto.getInitialCash());

        return balanceRepository.save(balance);
    }

    public void delete() {
        if (!balanceRepository.existsById((byte) 1)) {
            throw new NotFoundException("Balance no encontrado");
        }
        balanceRepository.deleteById((byte) 1);
    }
}
