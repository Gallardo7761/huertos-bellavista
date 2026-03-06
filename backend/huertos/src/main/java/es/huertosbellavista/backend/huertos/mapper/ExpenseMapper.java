package es.huertosbellavista.backend.huertos.mapper;

import es.huertosbellavista.backend.huertos.dto.ExpenseDto;
import es.huertosbellavista.backend.huertos.model.Expense;

public class ExpenseMapper {

    public static ExpenseDto.Response toResponse(Expense entity) {
        if (entity == null) return null;

        ExpenseDto.Response dto = new ExpenseDto.Response();
        dto.setExpenseId(entity.getExpenseId());
        dto.setConcept(entity.getConcept());
        dto.setAmount(entity.getAmount());
        dto.setSupplier(entity.getSupplier());
        dto.setInvoice(entity.getInvoice());
        dto.setType(entity.getType());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    public static Expense toEntity(ExpenseDto.Request dto) {
        if (dto == null) return null;

        Expense entity = new Expense();
        entity.setConcept(dto.getConcept());
        entity.setAmount(dto.getAmount());
        entity.setSupplier(dto.getSupplier());
        entity.setInvoice(dto.getInvoice());
        entity.setType(dto.getType());
        entity.setCreatedAt(dto.getCreatedAt());
        return entity;
    }
}
