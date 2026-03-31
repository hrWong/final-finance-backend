package com.vazy.finalfinance.wallet.mapper;

import com.vazy.finalfinance.wallet.entity.WalletAccount;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.math.BigDecimal;

@Mapper
public interface WalletMapper {
    WalletAccount getWalletByUserId(@Param("userId") String userId);
    int createWallet(WalletAccount account);
    int addBalance(@Param("userId") String userId, @Param("amount") BigDecimal amount);
}
