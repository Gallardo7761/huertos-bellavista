package es.huertosbellavista.backend.huertos.controller;

import es.huertosbellavista.backend.huertos.dto.ExpenseDto;
import es.huertosbellavista.backend.huertos.mapper.ExpenseMapper;
import es.huertosbellavista.backend.huertos.model.Expense;
import es.huertosbellavista.backend.huertos.service.ExpenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {
    private ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<List<ExpenseDto.Response>> getAll() {
        return ResponseEntity.ok(
            expenseService.getAll()
                .stream()
                .map(ExpenseMapper::toResponse)
                .toList()
        );
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<ExpenseDto.Response> create(@RequestBody ExpenseDto.Request dto) {
        return ResponseEntity.ok(
            ExpenseMapper.toResponse(
                expenseService.create(
                    ExpenseMapper.toEntity(dto)
                )));
    }

    @GetMapping("/{expense_id}")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<ExpenseDto.Response> getById(@PathVariable("expense_id") UUID expenseId) {
        Expense expense = expenseService.getById(expenseId);
        return ResponseEntity.ok(ExpenseMapper.toResponse(expense));
    }

    @PutMapping("/{expense_id}")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<ExpenseDto.Response> update(
        @PathVariable("expense_id") UUID expenseId,
        @RequestBody ExpenseDto.Request dto
    ) {
        Expense updated = expenseService.update(
            expenseId,
            ExpenseMapper.toEntity(dto)
        );

        return ResponseEntity.ok(
            ExpenseMapper.toResponse(updated)
        );
    }

    @DeleteMapping("/{expense_id}")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<Map<String,String>> delete(@PathVariable("expense_id") UUID expenseId) {
        expenseService.delete(expenseId);
        return ResponseEntity.ok(Map.of("message", "Deleted expense: " + expenseId));
    }
}
