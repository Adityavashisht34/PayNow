package com.payment.wallet.PaymentWallet.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Component
@Document(collection = "users")
public class User {
    @Id
    private String userId;

    private String userAccountId;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String mobile;
    
    // Simple status field
    private String status = "ACTIVE"; // ACTIVE, INACTIVE
    
    // Simple timestamp fields
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime lastLoginAt;

    // Simple relationships - just store IDs
    private List<String> transactionIds = new ArrayList<>();
    private String addressId;

    // Helper method to get full name
    public String getFullName() {
        return firstName + " " + lastName;
    }

    // Helper method to update login time
    public void updateLastLogin() {
        this.lastLoginAt = LocalDateTime.now();
    }
}