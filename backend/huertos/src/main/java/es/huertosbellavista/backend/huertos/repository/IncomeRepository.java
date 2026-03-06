package es.huertosbellavista.backend.huertos.repository;

import es.huertosbellavista.backend.huertos.model.Income;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncomeRepository extends JpaRepository<Income, byte[]> {
}
