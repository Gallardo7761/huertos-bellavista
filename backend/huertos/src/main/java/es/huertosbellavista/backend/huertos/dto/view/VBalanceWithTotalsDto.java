package es.huertosbellavista.backend.huertos.dto.view;

import java.math.BigDecimal;
import java.time.Instant;

public class VBalanceWithTotalsDto {
    private Byte id;
    private BigDecimal initialBank;
    private BigDecimal initialCash;
    private BigDecimal totalBankExpenses;
    private BigDecimal totalCashExpenses;
    private BigDecimal totalBankIncomes;
    private BigDecimal totalCashIncomes;
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

    public BigDecimal getTotalBankExpenses() {
        return totalBankExpenses;
    }

    public void setTotalBankExpenses(BigDecimal totalBankExpenses) {
        this.totalBankExpenses = totalBankExpenses;
    }

    public BigDecimal getTotalCashExpenses() {
        return totalCashExpenses;
    }

    public void setTotalCashExpenses(BigDecimal totalCashExpenses) {
        this.totalCashExpenses = totalCashExpenses;
    }

    public BigDecimal getTotalBankIncomes() {
        return totalBankIncomes;
    }

    public void setTotalBankIncomes(BigDecimal totalBankIncomes) {
        this.totalBankIncomes = totalBankIncomes;
    }

    public BigDecimal getTotalCashIncomes() {
        return totalCashIncomes;
    }

    public void setTotalCashIncomes(BigDecimal totalCashIncomes) {
        this.totalCashIncomes = totalCashIncomes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
