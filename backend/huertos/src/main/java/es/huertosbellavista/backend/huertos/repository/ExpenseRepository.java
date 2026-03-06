package es.huertosbellavista.backend.huertos.repository;

import es.huertosbellavista.backend.huertos.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepository extends JpaRepository<Expense, byte[]> {}
