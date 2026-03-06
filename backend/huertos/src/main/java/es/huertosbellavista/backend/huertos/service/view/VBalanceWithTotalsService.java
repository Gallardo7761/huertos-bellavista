package es.huertosbellavista.backend.huertos.service.view;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import es.huertosbellavista.backend.huertos.model.view.VBalanceWithTotals;
import es.huertosbellavista.backend.huertos.repository.view.VBalanceWithTotalsRepository;

@Service
@Transactional
public class VBalanceWithTotalsService {

    private final VBalanceWithTotalsRepository repository;

    public VBalanceWithTotalsService(VBalanceWithTotalsRepository repository) {
        this.repository = repository;
    }

    public List<VBalanceWithTotals> getAll() {
        return repository.findAll();
    }
}
