package com.vazy.finalfinance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FinalFinanceBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(FinalFinanceBackendApplication.class, args);
    }
}
