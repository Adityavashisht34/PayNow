package com.payment.wallet.PaymentWallet.service;

import com.payment.wallet.PaymentWallet.entity.User;
import com.payment.wallet.PaymentWallet.repo.UserRepo;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private OTPService otpService;

    // Generate new user and account IDs
    public String[] createUserAccountId() {
        ObjectId userId = new ObjectId();
        ObjectId accountId = new ObjectId();
        return new String[]{userId.toHexString(), accountId.toHexString()};
    }

    // Create a new user
    public User createUser(User user) {
        Optional<User> existingUser = userRepo.findByEmailOrMobile(user.getEmail(), user.getMobile());
        if (existingUser.isPresent()) {
            throw new RuntimeException("User with this email or mobile already exists");
        }

        // Encrypt password if provided (password is optional for OTP-only users)
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        
        user.setCreatedAt(LocalDateTime.now());
        user.setStatus("ACTIVE");
        
        return userRepo.save(user);
    }

    // Login with email/mobile and password
    public User loginWithPassword(String emailOrMobile, String password) {
        Optional<User> dbUser = userRepo.findByEmailOrMobile(emailOrMobile, emailOrMobile);
        
        if (dbUser.isPresent()) {
            User user = dbUser.get();
            
            // Check if user has password and it matches
            if (user.getPassword() != null && passwordEncoder.matches(password, user.getPassword())) {
                user.updateLastLogin();
                userRepo.save(user);
                return user;
            }
        }
        
        throw new RuntimeException("Invalid email/mobile or password");
    }

    // Send OTP for login
    public boolean sendLoginOTP(String emailOrMobile) {
        Optional<User> dbUser = userRepo.findByEmailOrMobile(emailOrMobile, emailOrMobile);
        
        if (dbUser.isPresent()) {
            User user = dbUser.get();
            return otpService.sendOTP(user.getUserId(), user.getEmail(), user.getMobile(), "LOGIN");
        }
        
        throw new RuntimeException("User not found");
    }

    // Verify OTP and login
    public User loginWithOTP(String emailOrMobile, String otpCode) {
        Optional<User> dbUser = userRepo.findByEmailOrMobile(emailOrMobile, emailOrMobile);
        
        if (dbUser.isPresent()) {
            User user = dbUser.get();
            
            if (otpService.verifyOTP(user.getUserId(), otpCode, "LOGIN")) {
                user.updateLastLogin();
                userRepo.save(user);
                return user;
            }
        }
        
        throw new RuntimeException("Invalid OTP or user not found");
    }

    // Send password reset OTP
    public boolean sendPasswordResetOTP(String emailOrMobile) {
        Optional<User> dbUser = userRepo.findByEmailOrMobile(emailOrMobile, emailOrMobile);
        
        if (dbUser.isPresent()) {
            User user = dbUser.get();
            return otpService.sendOTP(user.getUserId(), user.getEmail(), user.getMobile(), "PASSWORD_RESET");
        }
        
        throw new RuntimeException("User not found");
    }

    // Reset password with OTP
    public boolean resetPasswordWithOTP(String emailOrMobile, String otpCode, String newPassword) {
        Optional<User> dbUser = userRepo.findByEmailOrMobile(emailOrMobile, emailOrMobile);
        
        if (dbUser.isPresent()) {
            User user = dbUser.get();
            
            if (otpService.verifyOTP(user.getUserId(), otpCode, "PASSWORD_RESET")) {
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepo.save(user);
                return true;
            }
        }
        
        return false;
    }

    // Send OTP for user actions (profile changes, etc.)
    public boolean sendUserActionOTP(String userId, String purpose) {
        Optional<User> dbUser = userRepo.findById(userId);
        
        if (dbUser.isPresent()) {
            User user = dbUser.get();
            return otpService.sendOTP(user.getUserId(), user.getEmail(), user.getMobile(), purpose);
        }
        
        throw new RuntimeException("User not found");
    }

    // Verify user action OTP
    public boolean verifyUserActionOTP(String userId, String otpCode, String purpose) {
        return otpService.verifyOTP(userId, otpCode, purpose);
    }

    // Find user by ID
    public User findUserById(String userId) {
        Optional<User> user = userRepo.findById(userId);
        if (user.isPresent()) {
            return user.get();
        }
        throw new RuntimeException("User not found");
    }

    // Get all users (for contacts)
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    // Update user password with OTP verification
    public void updatePasswordWithOTP(String userId, String otpCode, String newPassword) {
        if (otpService.verifyOTP(userId, otpCode, "PASSWORD_RESET")) {
            Optional<User> dbUser = userRepo.findById(userId);
            if (dbUser.isPresent()) {
                User user = dbUser.get();
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepo.save(user);
            } else {
                throw new RuntimeException("User not found");
            }
        } else {
            throw new RuntimeException("Invalid or expired OTP");
        }
    }
}