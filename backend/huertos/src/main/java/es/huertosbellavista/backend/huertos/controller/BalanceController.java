package es.huertosbellavista.backend.huertos.controller;

import es.huertosbellavista.backend.huertos.dto.BalanceDto;
import es.huertosbellavista.backend.huertos.dto.view.VBalanceWithTotalsDto;
import es.huertosbellavista.backend.huertos.mapper.BalanceMapper;
import es.huertosbellavista.backend.huertos.mapper.view.VBalanceWithTotalsMapper;
import es.huertosbellavista.backend.huertos.model.Balance;
import es.huertosbellavista.backend.huertos.service.BalanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/balance")
public class BalanceController {
    private final BalanceService balanceService;

    public BalanceController(BalanceService balanceService) {
        this.balanceService = balanceService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<BalanceDto> getBalance() {
        Balance balance = balanceService.get();
        return ResponseEntity.ok(BalanceMapper.toDto(balance));
    }

    @GetMapping("/with-totals")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<VBalanceWithTotalsDto> getWithTotals() {
        return ResponseEntity.ok(VBalanceWithTotalsMapper.toDto(balanceService.getWithTotals()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<BalanceDto> setBalance(BalanceDto dto) {
        return ResponseEntity.ok(
            BalanceMapper.toDto(
                balanceService.create(BalanceMapper.toEntity(dto))
            )
        );
    }
}
