# final-finance-backend

# Backend Scaffold

This directory contains a Spring Boot backend scaffold for the finance frontend.

## Stack

- Java 21
- Spring Boot 3
- Maven
- MySQL
- Flyway
- MyBatis
- WebClient
- Caffeine cache

## Run

1. Create a MySQL database named `final_finance`.
2. Update datasource credentials in `src/main/resources/application.yml`.
3. Start with:

```bash
mvn spring-boot:run
```

## Current state

- Architecture and package structure are in place.
- Core APIs are scaffolded.
- Flyway migration creates the 4 agreed tables.
- Transaction to position rebuild flow is stubbed and ready for business logic.
- Yahoo market data integration is abstracted but not fully wired to a specific response schema yet.
