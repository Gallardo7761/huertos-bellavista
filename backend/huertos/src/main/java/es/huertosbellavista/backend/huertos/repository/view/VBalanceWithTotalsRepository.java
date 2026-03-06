package es.huertosbellavista.backend.huertos.repository.view;

import es.huertosbellavista.backend.huertos.model.view.VBalanceWithTotals;
import org.springframework.data.repository.Repository;

import java.util.List;
import java.util.Optional;

public interface VBalanceWithTotalsRepository extends Repository<VBalanceWithTotals, Byte> {
    List<VBalanceWithTotals> findAll();
    Optional<VBalanceWithTotals> findById(Byte id);
}
