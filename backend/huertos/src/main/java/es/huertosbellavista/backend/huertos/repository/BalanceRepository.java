package es.huertosbellavista.backend.huertos.repository;

import es.huertosbellavista.backend.huertos.model.Balance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BalanceRepository extends JpaRepository<Balance, Short> {

}
