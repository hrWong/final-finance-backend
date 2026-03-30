package com.vazy.finalfinance.asset.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Asset {
    private Long id;
    private String symbol;
    private String exchange;
    private String name;
    private String nameZh;
    private String assetType;
    private String currency;
    private String country;
    private String sector;
    private String industry;
    private String isin;
    private String iconUrl;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
