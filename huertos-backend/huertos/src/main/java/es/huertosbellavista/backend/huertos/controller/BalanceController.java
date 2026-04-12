package es.huertosbellavista.backend.huertos.controller;

import es.huertosbellavista.backend.huertos.dto.BalanceDto;
import es.huertosbellavista.backend.huertos.dto.view.VBalanceWithTotalsDto;
import es.huertosbellavista.backend.huertos.mapper.BalanceMapper;
import es.huertosbellavista.backend.huertos.mapper.view.VBalanceWithTotalsMapper;
import es.huertosbellavista.backend.huertos.model.Balance;
import es.huertosbellavista.backend.huertos.service.BalanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/balance")
public class BalanceController {
    private final BalanceService balanceService;

    public BalanceController(BalanceService balanceService) {
        this.balanceService = balanceService;
    }

    @GetMapping("/{year}")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<BalanceDto> getBalance(@PathVariable("year") short year) {
        Balance balance = balanceService.get(year);
        return ResponseEntity.ok(BalanceMapper.toDto(balance));
    }

    @GetMapping("/with-totals/{year}")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<VBalanceWithTotalsDto> getWithTotals(@PathVariable("year") short year) {
        return ResponseEntity.ok(balanceService.getWithTotals(year));
    }

    @GetMapping("/years")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<List<Short>> getYears() {
        return ResponseEntity.ok(balanceService.getAvailableYears());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<BalanceDto> create(@RequestBody BalanceDto dto) {
        Balance created = balanceService.create(BalanceMapper.toEntity(dto));
        return ResponseEntity.ok(BalanceMapper.toDto(created));
    }

    @PutMapping("/{year}")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<BalanceDto> update(
            @PathVariable("year") short year,
            @RequestBody BalanceDto dto
    ) {
        Balance updated = balanceService.update(year, BalanceMapper.toEntity(dto));
        return ResponseEntity.ok(BalanceMapper.toDto(updated));
    }

    @DeleteMapping("/{year}")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<Map<String, String>> delete(@PathVariable("year") short year) {
        balanceService.delete(year);
        return ResponseEntity.ok(Map.of("message", "Balance del año " + year + " borrado"));
    }
}
