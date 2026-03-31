package com.vazy.finalfinance.wallet.service;

import com.vazy.finalfinance.wallet.mapper.WalletMapper;
import com.vazy.finalfinance.wallet.entity.WalletAccount;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class WalletService {

    private final WalletMapper walletMapper;

    public WalletService(WalletMapper walletMapper) {
        this.walletMapper = walletMapper;
    }

    public BigDecimal getBalance(String userId) {
        WalletAccount account = walletMapper.getWalletByUserId(userId);
        return account != null ? account.getBalance() : BigDecimal.ZERO;
    }

    @Transactional
    public BigDecimal recharge(String userId, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("充值金额必须大于0");
        }
        WalletAccount account = walletMapper.getWalletByUserId(userId);
        if (account == null) {
            account = new WalletAccount();
            account.setUserId(userId);
            account.setBalance(amount);
            walletMapper.createWallet(account);
        } else {
            walletMapper.addBalance(userId, amount);
        }
        return getBalance(userId);
    }

    @Transactional
    public void updateBalance(String userId, BigDecimal delta) {
        if (delta == null || delta.compareTo(BigDecimal.ZERO) == 0) {
            return;
        }

        WalletAccount account = walletMapper.getWalletByUserId(userId);
        if (account == null) {
            // No wallet yet, cannot deduct further
            if (delta.compareTo(BigDecimal.ZERO) < 0) {
                throw new IllegalArgumentException("钱包余额不足（未开户）");
            }
            account = new WalletAccount();
            account.setUserId(userId);
            account.setBalance(delta);
            walletMapper.createWallet(account);
        } else {
            // If deducting money, ensure balance >= abs(delta)
            if (delta.compareTo(BigDecimal.ZERO) < 0) {
                BigDecimal currentBalance = account.getBalance() != null ? account.getBalance() : BigDecimal.ZERO;
                if (currentBalance.add(delta).compareTo(BigDecimal.ZERO) < 0) {
                    throw new IllegalArgumentException("钱包余额不足！当前余额: " + currentBalance + ", 需要扣款: " + delta.negate());
                }
            }
            walletMapper.addBalance(userId, delta);
        }
    }
}
