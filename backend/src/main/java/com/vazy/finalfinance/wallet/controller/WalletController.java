package com.vazy.finalfinance.wallet.controller;

import com.vazy.finalfinance.wallet.dto.RechargeRequest;
import com.vazy.finalfinance.wallet.service.WalletService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @PostMapping("/recharge")
    public Object recharge(@RequestBody RechargeRequest request) {
        BigDecimal newBalance = walletService.recharge("default_user", request.getAmount());
        return Map.of("success", true, "data", newBalance);
    }

    @GetMapping("/balance")
    public Object getBalance() {
        return Map.of("success", true, "data", walletService.getBalance("default_user"));
    }
}
