package es.huertosbellavista.backend.huertos.controller;

import es.huertosbellavista.backend.huertos.dto.IncomeDto;
import es.huertosbellavista.backend.huertos.dto.view.VIncomesWithInfoDto;
import es.huertosbellavista.backend.huertos.mapper.IncomeMapper;
import es.huertosbellavista.backend.huertos.mapper.view.VIncomesWithInfoMapper;
import es.huertosbellavista.backend.huertos.model.Income;
import es.huertosbellavista.backend.huertos.service.IncomeService;
import es.huertosbellavista.backend.huertos.service.view.VIncomesWithInfoService;
import net.miarma.backlib.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/incomes")
public class IncomeController {
    private IncomeService incomeService;
    private VIncomesWithInfoService vIncomesWithInfoService;
    private JwtService jwtService;

    public IncomeController(IncomeService incomeService, VIncomesWithInfoService vIncomesWithInfoService, JwtService jwtService) {
        this.incomeService = incomeService;
        this.vIncomesWithInfoService = vIncomesWithInfoService;
        this.jwtService = jwtService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<List<IncomeDto.Response>> getAll() {
        return ResponseEntity.ok(
            incomeService.getAll()
                .stream()
                .map(IncomeMapper::toResponse)
                .toList()
        );
    }

    @GetMapping("/with-info")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<List<VIncomesWithInfoDto>> getAllWithInfo() {
        return ResponseEntity.ok(
            vIncomesWithInfoService.getAll()
                .stream()
                .map(VIncomesWithInfoMapper::toResponse)
                .toList()
        );
    }

    @GetMapping("/mine")
    public ResponseEntity<List<IncomeDto.Response>> getMine(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = authHeader.substring(7);

        UUID userId;
        try {
            userId = jwtService.getUserId(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(
            incomeService.getByUserId(userId)
                .stream()
                .map(IncomeMapper::toResponse)
                .toList()
        );
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<IncomeDto.Response> create(@RequestBody IncomeDto.Request dto) {
        return ResponseEntity.ok(
            IncomeMapper.toResponse(
                incomeService.create(
                    IncomeMapper.toEntity(dto)
                )));
    }

    @GetMapping("/{income_id}")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<IncomeDto.Response> getById(@PathVariable("income_id") UUID incomeId) {
        Income income = incomeService.getById(incomeId);
        return ResponseEntity.ok(IncomeMapper.toResponse(income));
    }

    @PutMapping("/{income_id}")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<IncomeDto.Response> update(
        @PathVariable("income_id") UUID incomeId,
        @RequestBody IncomeDto.Request dto
    ) {
        IO.println(dto.getCreatedAt());
        return ResponseEntity.ok(
                IncomeMapper.toResponse(
                        incomeService.update(
                                incomeId, IncomeMapper.toEntity(dto))));
    }

    @DeleteMapping("/{income_id}")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<Map<String,String>> delete(@PathVariable("income_id") UUID incomeId) {
        incomeService.delete(incomeId);
        return ResponseEntity.ok(Map.of("message", "Deleted income: " + incomeId));
    }
}
