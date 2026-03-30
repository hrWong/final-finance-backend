package com.vazy.finalfinance.transaction.controller;

import com.vazy.finalfinance.common.response.ApiResponse;
import com.vazy.finalfinance.transaction.dto.CreateTransactionRequest;
import com.vazy.finalfinance.transaction.dto.UpdateTransactionRequest;
import com.vazy.finalfinance.transaction.service.TransactionService;
import com.vazy.finalfinance.transaction.vo.TransactionResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public ApiResponse<List<TransactionResponse>> findAll(
            @RequestParam(value = "symbol", required = false) String symbol,
            @RequestParam(value = "type", required = false) String type
    ) {
        return ApiResponse.success(transactionService.findAll(symbol, type));
    }

    @GetMapping("/{id}")
    public ApiResponse<TransactionResponse> findById(@PathVariable Long id) {
        return ApiResponse.success(transactionService.findById(id));
    }

    @PostMapping
    public ApiResponse<TransactionResponse> create(@Valid @RequestBody CreateTransactionRequest request) {
        return ApiResponse.success(transactionService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<TransactionResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTransactionRequest request
    ) {
        return ApiResponse.success(transactionService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        transactionService.delete(id);
        return ApiResponse.success(null);
    }
}
