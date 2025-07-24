package com.payment.wallet.PaymentWallet.controllers;

import com.payment.wallet.PaymentWallet.entity.Transaction;
import com.payment.wallet.PaymentWallet.entity.Wallet;
import com.payment.wallet.PaymentWallet.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/wallet")
@CrossOrigin(origins = "https://paynow-ruby.vercel.app/")
public class WalletController {

    @Autowired
    private WalletService walletService;

    // Get user balance
    @GetMapping("/balance/{userId}")
    public ResponseEntity<?> getBalance(@PathVariable String userId) {
        try {
            Double balance = walletService.getBalance(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Balance retrieved successfully");
            response.put("data", Map.of("balance", balance));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to get balance");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get user transactions
    @GetMapping("/transactions/{userId}")
    public ResponseEntity<?> getTransactions(@PathVariable String userId) {
        try {
            List<Transaction> transactions = walletService.getUserTransactions(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Transactions retrieved successfully");
            response.put("data", transactions);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to get transactions");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Send OTP for transaction
    @PostMapping("/send-transaction-otp")
    public ResponseEntity<?> sendTransactionOTP(@RequestBody Map<String, String> request) {
        try {
            String userId = request.get("userId");
            String purpose = request.get("purpose"); // TRANSACTION or ADD_MONEY
            
            boolean sent = walletService.sendTransactionOTP(userId, purpose);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", sent);
            response.put("message", sent ? "OTP sent successfully" : "Failed to send OTP");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to send OTP");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Send money with OTP
    @Transactional
    @PostMapping("/send-with-otp")
    public ResponseEntity<?> sendMoneyWithOTP(@RequestBody Map<String, Object> request) {
        try {
            String fromUserId = (String) request.get("fromUserId");
            String toUserEmail = (String) request.get("toUserEmail");
            Double amount = Double.valueOf(request.get("amount").toString());
            String description = (String) request.get("description");
            String otpCode = (String) request.get("otpCode");
            
            Transaction transaction = walletService.sendMoneyWithOTP(fromUserId, toUserEmail, amount, description, otpCode);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Money sent successfully");
            response.put("data", transaction);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Add money with OTP
    @Transactional
    @PostMapping("/add-money-with-otp")
    public ResponseEntity<?> addMoneyWithOTP(@RequestBody Map<String, Object> request) {
        try {
            String userId = (String) request.get("userId");
            Double amount = Double.valueOf(request.get("amount").toString());
            String description = (String) request.get("description");
            String otpCode = (String) request.get("otpCode");
            
            Transaction transaction = walletService.addMoneyWithOTP(userId, amount, description, otpCode);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Money added successfully");
            response.put("data", transaction);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Legacy endpoints (without OTP) for backward compatibility
    @Transactional
    @PostMapping("/send")
    public ResponseEntity<?> sendMoney(@RequestBody Map<String, Object> request) {
        try {
            String fromUserId = (String) request.get("fromUserId");
            String toUserEmail = (String) request.get("toUserEmail");
            Double amount = Double.valueOf(request.get("amount").toString());
            String description = (String) request.get("description");
            
            Transaction transaction = walletService.sendMoney(fromUserId, toUserEmail, amount, description);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Money sent successfully");
            response.put("data", transaction);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @Transactional
    @PostMapping("/add-money")
    public ResponseEntity<?> addMoney(@RequestBody Map<String, Object> request) {
        try {
            String userId = (String) request.get("userId");
            Double amount = Double.valueOf(request.get("amount").toString());
            String description = (String) request.get("description");
            
            Transaction transaction = walletService.addMoney(userId, amount, description);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Money added successfully");
            response.put("data", transaction);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to add money");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Create wallet for user
    @PostMapping("/create/{userId}")
    public ResponseEntity<?> createWallet(@PathVariable String userId) {
        try {
            Wallet wallet = walletService.createWallet(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Wallet created successfully");
            response.put("data", wallet);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to create wallet");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
