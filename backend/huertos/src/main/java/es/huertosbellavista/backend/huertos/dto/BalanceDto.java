package es.huertosbellavista.backend.huertos.dto;

import java.math.BigDecimal;
import java.time.Instant;

public class BalanceDto {
    private Byte id;
    private BigDecimal initialBank;
    private BigDecimal initialCash;
    private Instant createdAt;

    public Byte getId() {
        return id;
    }

    public void setId(Byte id) {
        this.id = id;
    }

    public BigDecimal getInitialBank() {
        return initialBank;
    }

    public void setInitialBank(BigDecimal initialBank) {
        this.initialBank = initialBank;
    }

    public BigDecimal getInitialCash() {
        return initialCash;
    }

    public void setInitialCash(BigDecimal initialCash) {
        this.initialCash = initialCash;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
