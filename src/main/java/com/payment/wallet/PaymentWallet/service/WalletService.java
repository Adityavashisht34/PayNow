package com.payment.wallet.PaymentWallet.service;

import com.payment.wallet.PaymentWallet.entity.Transaction;
import com.payment.wallet.PaymentWallet.entity.User;
import com.payment.wallet.PaymentWallet.entity.Wallet;
import com.payment.wallet.PaymentWallet.repo.TransactionRepo;
import com.payment.wallet.PaymentWallet.repo.UserRepo;
import com.payment.wallet.PaymentWallet.repo.WalletRepo;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WalletService {

    @Autowired
    private WalletRepo walletRepo;
    
    @Autowired
    private TransactionRepo transactionRepo;
    
    @Autowired
    private UserRepo userRepo;
    
    @Autowired
    private OTPService otpService;

    // Create wallet for new user with 0 starting balance
    public Wallet createWallet(String userId) {
        Wallet wallet = new Wallet();
        wallet.setWalletId(new ObjectId().toHexString());
        wallet.setUserId(userId);
        wallet.setBalance(0.0);
        wallet.setCreatedAt(LocalDateTime.now());
        
        return walletRepo.save(wallet);
    }

    // Get wallet by user ID
    public Wallet getWalletByUserId(String userId) {
        Optional<Wallet> wallet = walletRepo.findByUserId(userId);
        
        if (wallet.isPresent()) {
            return wallet.get();
        } else {
            return createWallet(userId);
        }
    }

    // Get user balance
    public Double getBalance(String userId) {
        Wallet wallet = getWalletByUserId(userId);
        return wallet.getBalance();
    }

    // Send OTP for transaction
    public boolean sendTransactionOTP(String userId, String purpose) {
        Optional<User> user = userRepo.findById(userId);
        if (user.isPresent()) {
            User userData = user.get();
            return otpService.sendOTP(userId, userData.getEmail(), userData.getMobile(), purpose);
        }
        return false;
    }

    // Send money with OTP verification
    public Transaction sendMoneyWithOTP(String fromUserId, String toUserEmail, Double amount, String description, String otpCode) {
        // Verify OTP first
        if (!otpService.verifyOTP(fromUserId, otpCode, "TRANSACTION")) {
            throw new RuntimeException("Invalid or expired OTP");
        }
        
        return performMoneyTransfer(fromUserId, toUserEmail, amount, description);
    }

    // Add money with OTP verification
    public Transaction addMoneyWithOTP(String userId, Double amount, String description, String otpCode) {
        // Verify OTP first
        if (!otpService.verifyOTP(userId, otpCode, "ADD_MONEY")) {
            throw new RuntimeException("Invalid or expired OTP");
        }
        
        return performAddMoney(userId, amount, description);
    }

    // Perform actual money transfer
    private Transaction performMoneyTransfer(String fromUserId, String toUserEmail, Double amount, String description) {
        Wallet fromWallet = getWalletByUserId(fromUserId);
        
        Optional<User> toUser = userRepo.findByEmail(toUserEmail);
        if (!toUser.isPresent()) {
            throw new RuntimeException("Receiver not found");
        }
        
        Wallet toWallet = getWalletByUserId(toUser.get().getUserId());
        
        if (!fromWallet.hasSufficientBalance(amount)) {
            throw new RuntimeException("Insufficient balance");
        }
        
        Transaction transaction = new Transaction();
        transaction.setTransactionId(new ObjectId().toHexString());
        transaction.setFromUserId(fromUserId);
        transaction.setToUserId(toUser.get().getUserId());
        transaction.setAmount(amount);
        transaction.setType("TRANSFER");
        transaction.setDescription(description);
        transaction.setReferenceNumber("REF" + System.currentTimeMillis());
        transaction.setCreatedAt(LocalDateTime.now());
        
        try {
            fromWallet.deductMoney(amount);
            walletRepo.save(fromWallet);
            
            toWallet.addMoney(amount);
            walletRepo.save(toWallet);
            
            transaction.markCompleted();
            
            // Send notifications
            sendTransactionNotifications(fromUserId, toUser.get().getUserId(), amount, description, "SENT");
            
        } catch (Exception e) {
            transaction.markFailed();
            throw new RuntimeException("Transaction failed: " + e.getMessage());
        }
        
        return transactionRepo.save(transaction);
    }

    // Perform add money operation
    private Transaction performAddMoney(String userId, Double amount, String description) {
        Wallet wallet = getWalletByUserId(userId);
        
        Transaction transaction = new Transaction();
        transaction.setTransactionId(new ObjectId().toHexString());
        transaction.setFromUserId("SYSTEM");
        transaction.setToUserId(userId);
        transaction.setAmount(amount);
        transaction.setType("DEPOSIT");
        transaction.setDescription(description != null ? description : "Balance added");
        transaction.setReferenceNumber("DEP" + System.currentTimeMillis());
        transaction.setCreatedAt(LocalDateTime.now());
        
        try {
            wallet.addMoney(amount);
            walletRepo.save(wallet);
            
            transaction.markCompleted();
            
            // Send notification
            sendTransactionNotifications(userId, userId, amount, description, "DEPOSIT");
            
        } catch (Exception e) {
            transaction.markFailed();
            throw new RuntimeException("Failed to add money: " + e.getMessage());
        }
        
        return transactionRepo.save(transaction);
    }

    // Send transaction notifications
    private void sendTransactionNotifications(String fromUserId, String toUserId, Double amount, String description, String type) {
        try {
            Optional<User> fromUser = userRepo.findById(fromUserId);
            Optional<User> toUser = userRepo.findById(toUserId);
            
            if (fromUser.isPresent()) {
                String message = buildTransactionMessage(fromUser.get(), amount, description, type);
                otpService.sendTransactionNotification(fromUser.get().getEmail(), fromUser.get().getMobile(), message);
            }
            
            // Send notification to receiver if different from sender
            if (!fromUserId.equals(toUserId) && toUser.isPresent()) {
                String message = buildTransactionMessage(toUser.get(), amount, description, "RECEIVED");
                otpService.sendTransactionNotification(toUser.get().getEmail(), toUser.get().getMobile(), message);
            }
        } catch (Exception e) {
            System.err.println("Failed to send transaction notifications: " + e.getMessage());
        }
    }

    // Build transaction message
    private String buildTransactionMessage(User user, Double amount, String description, String type) {
        String action = switch (type) {
            case "SENT" -> "sent";
            case "RECEIVED" -> "received";
            case "DEPOSIT" -> "added to your wallet";
            default -> "processed";
        };
        
        return String.format(
            "Dear %s, ₹%.2f has been %s. %s. Transaction time: %s",
            user.getFirstName(),
            amount,
            action,
            description != null ? description : "",
            LocalDateTime.now().toString()
        );
    }

    // Get user transactions with enhanced details
    public List<Transaction> getUserTransactions(String userId) {
        List<Transaction> transactions = transactionRepo.findByFromUserIdOrToUserIdOrderByCreatedAtDesc(userId, userId);
        
        // Enhance transactions with user names
        return transactions.stream().map(transaction -> {
            // Get sender name
            if (!"SYSTEM".equals(transaction.getFromUserId())) {
                Optional<User> fromUser = userRepo.findById(transaction.getFromUserId());
                if (fromUser.isPresent()) {
                    User user = fromUser.get();
                    transaction.setFromUserName(user.getFirstName() + " " + user.getLastName());
                } else {
                    transaction.setFromUserName("Unknown User");
                }
            } else {
                transaction.setFromUserName("System");
            }
            
            // Get receiver name
            Optional<User> toUser = userRepo.findById(transaction.getToUserId());
            if (toUser.isPresent()) {
                User user = toUser.get();
                transaction.setToUserName(user.getFirstName() + " " + user.getLastName());
            } else {
                transaction.setToUserName("Unknown User");
            }
            
            return transaction;
        }).collect(Collectors.toList());
    }

    // Legacy methods for backward compatibility (without OTP)
    public Transaction sendMoney(String fromUserId, String toUserEmail, Double amount, String description) {
        return performMoneyTransfer(fromUserId, toUserEmail, amount, description);
    }

    public Transaction addMoney(String userId, Double amount, String description) {
        return performAddMoney(userId, amount, description);
    }
}