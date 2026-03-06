package es.huertosbellavista.backend.huertos.repository.view;

import es.huertosbellavista.backend.huertos.model.view.VIncomesWithInfo;
import org.springframework.data.repository.Repository;

import java.util.List;
import java.util.Optional;

public interface VIncomesWithInfoRepository extends Repository<VIncomesWithInfo, byte[]> {
    List<VIncomesWithInfo> findAll();
    Optional<VIncomesWithInfo> findById(byte[] incomeId);
}
