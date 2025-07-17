package com.payment.wallet.PaymentWallet.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "wallets")
public class Wallet {
    @Id
    private String walletId;
    
    private String userId;
    private Double balance = 0.0;
    private String currency = "INR";
    private String status = "ACTIVE"; // ACTIVE, INACTIVE, BLOCKED
    
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime lastUpdatedAt = LocalDateTime.now();
    
    // Simple method to add money
    public void addMoney(Double amount) {
        this.balance += amount;
        this.lastUpdatedAt = LocalDateTime.now();
    }
    
    // Simple method to deduct money
    public boolean deductMoney(Double amount) {
        if (this.balance >= amount) {
            this.balance -= amount;
            this.lastUpdatedAt = LocalDateTime.now();
            return true;
        }
        return false;
    }
    
    // Check if wallet has sufficient balance
    public boolean hasSufficientBalance(Double amount) {
        return this.balance >= amount;
    }
}