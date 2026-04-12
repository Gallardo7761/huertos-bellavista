package es.huertosbellavista.backend.huertos.model.view;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Immutable;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Immutable
@Table(name = "v_balance_with_totals")
public class VBalanceWithTotals {

    @Id
    private Short year;

    @Column(name = "initial_bank")
    private BigDecimal initialBank;

    @Column(name = "initial_cash")
    private BigDecimal initialCash;

    @Column(name = "total_bank_expenses")
    private BigDecimal totalBankExpenses;

    @Column(name = "total_cash_expenses")
    private BigDecimal totalCashExpenses;

    @Column(name = "total_bank_incomes")
    private BigDecimal totalBankIncomes;

    @Column(name = "total_cash_incomes")
    private BigDecimal totalCashIncomes;

    @Column(name = "created_at")
    private Instant createdAt;

    public Short getYear() {
        return year;
    }

    public BigDecimal getInitialBank() {
        return initialBank;
    }

    public BigDecimal getInitialCash() {
        return initialCash;
    }

    public BigDecimal getTotalBankExpenses() {
        return totalBankExpenses;
    }

    public BigDecimal getTotalCashExpenses() {
        return totalCashExpenses;
    }

    public BigDecimal getTotalBankIncomes() {
        return totalBankIncomes;
    }

    public BigDecimal getTotalCashIncomes() {
        return totalCashIncomes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
