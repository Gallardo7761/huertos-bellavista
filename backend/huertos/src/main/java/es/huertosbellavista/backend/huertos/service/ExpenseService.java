package es.huertosbellavista.backend.huertos.service;

import jakarta.transaction.Transactional;
import es.huertosbellavista.backend.huertos.model.Expense;
import es.huertosbellavista.backend.huertos.repository.ExpenseRepository;
import net.miarma.backlib.exception.NotFoundException;
import net.miarma.backlib.exception.ValidationException;
import net.miarma.backlib.util.UuidUtil;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public List<Expense> getAll() {
        return expenseRepository.findAll().stream()
            .sorted(Comparator.comparing(Expense::getCreatedAt).reversed())
            .toList();
    }

    public Expense getById(UUID expenseId) {
        byte[] idBytes = UuidUtil.uuidToBin(expenseId);
        return expenseRepository.findById(idBytes)
                .orElseThrow(() -> new NotFoundException("Gasto no encontrado"));
    }

    public Expense create(Expense expense) {
        if (expense.getConcept() == null || expense.getConcept().isBlank()) {
            throw new ValidationException("concept", "El concepto es obligatorio");
        }
        if (expense.getAmount() == null) {
            throw new ValidationException("amount", "La cantidad es obligatoria");
        }
        if (expense.getSupplier() == null || expense.getSupplier().isBlank()) {
            throw new ValidationException("supplier", "El proveedor es obligatorio");
        }
        if (expense.getInvoice() == null || expense.getInvoice().isBlank()) {
            throw new ValidationException("invoice", "La factura es obligatoria");
        }
        if (expense.getCreatedAt() == null) {
            expense.setCreatedAt(Instant.now());
        }

        expense.setExpenseId(UUID.randomUUID());

        return expenseRepository.save(expense);
    }

    public Expense update(UUID expenseId, Expense changes) {
        byte[] idBytes = UuidUtil.uuidToBin(expenseId);

        Expense expense = expenseRepository.findById(idBytes)
                .orElseThrow(() -> new NotFoundException("Gasto no encontrado"));

        if (changes.getConcept() != null)
            expense.setConcept(changes.getConcept());

        if (changes.getAmount() != null)
            expense.setAmount(changes.getAmount());

        if (changes.getSupplier() != null)
            expense.setSupplier(changes.getSupplier());

        if (changes.getInvoice() != null)
            expense.setInvoice(changes.getInvoice());

        if (changes.getType() != null)
            expense.setType(changes.getType());

        if (changes.getCreatedAt() != null)
            expense.setCreatedAt(changes.getCreatedAt());

        return expenseRepository.save(expense);
    }

    public void delete(UUID expenseId) {
        byte[] idBytes = UuidUtil.uuidToBin(expenseId);
        if (!expenseRepository.existsById(idBytes)) {
            throw new NotFoundException("Gasto no encontrado");
        }
        expenseRepository.deleteById(idBytes);
    }
}
