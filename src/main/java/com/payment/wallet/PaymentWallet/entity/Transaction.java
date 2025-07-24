package com.payment.wallet.PaymentWallet.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "transactions")
public class Transaction {
    @Id
    private String transactionId;
    
    private String fromUserId;
    private String toUserId;
    private Double amount; // Using Double for simplicity
    private String currency = "INR";
    
    private String type; // SEND, RECEIVE, DEPOSIT, WITHDRAW, TRANSFER
    private String status = "PENDING"; // PENDING, COMPLETED, FAILED
    
    private String description;
    private String referenceNumber;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime completedAt;
    
    // Enhanced fields for frontend display
    private String fromUserName; // Will be populated by service
    private String toUserName;   // Will be populated by service
    

    public void markCompleted() {
        this.status = "COMPLETED";
        this.completedAt = LocalDateTime.now();
    }

    public void markFailed() {
        this.status = "FAILED";
    }
}