package es.huertosbellavista.backend.huertos.dto;

import java.math.BigDecimal;
import java.time.Instant;

public class BalanceDto {
    private Short year;
    private BigDecimal initialBank;
    private BigDecimal initialCash;
    private Instant createdAt;

    public Short getYear() {
        return year;
    }

    public void setYear(Short year) {
        this.year = year;
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
