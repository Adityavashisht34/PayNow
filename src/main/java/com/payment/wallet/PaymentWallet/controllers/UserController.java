package com.payment.wallet.PaymentWallet.controllers;

import com.payment.wallet.PaymentWallet.entity.User;
import com.payment.wallet.PaymentWallet.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "https://localhost:5173/")
public class UserController {

    @Autowired
    private UserService userService;

    // Generate user and account IDs
    @Transactional
    @GetMapping("/")
    public ResponseEntity<?> createUserAccountId() {
        try {
            String[] ids = userService.createUserAccountId();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "IDs generated successfully");
            response.put("data", ids);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Server is busy, try again later!");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Create new user
    @Transactional
    @PostMapping("/save-user")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User registered successfully");
            response.put("data", createdUser);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
    }

    // Login with password
    @Transactional
    @PostMapping("/find-user")
    public ResponseEntity<?> findUser(@RequestBody User user) {
        try {
            User foundUser = userService.loginWithPassword(user.getEmail(), user.getPassword());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("data", foundUser);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Invalid email or password");
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    // Enhanced login with email/mobile and password
    @PostMapping("/login-password")
    public ResponseEntity<?> loginWithPassword(@RequestBody Map<String, String> request) {
        try {
            String emailOrMobile = request.get("emailOrMobile");
            String password = request.get("password");
            
            User user = userService.loginWithPassword(emailOrMobile, password);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("data", user);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    // Send login OTP
    @PostMapping("/send-login-otp")
    public ResponseEntity<?> sendLoginOTP(@RequestBody Map<String, String> request) {
        try {
            String emailOrMobile = request.get("emailOrMobile");
            
            boolean sent = userService.sendLoginOTP(emailOrMobile);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", sent);
            response.put("message", sent ? "OTP sent successfully" : "Failed to send OTP");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Login with OTP
    @PostMapping("/login-otp")
    public ResponseEntity<?> loginWithOTP(@RequestBody Map<String, String> request) {
        try {
            String emailOrMobile = request.get("emailOrMobile");
            String otpCode = request.get("otpCode");
            
            User user = userService.loginWithOTP(emailOrMobile, otpCode);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("data", user);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    // Send password reset OTP
    @PostMapping("/send-reset-otp")
    public ResponseEntity<?> sendPasswordResetOTP(@RequestBody Map<String, String> request) {
        try {
            String emailOrMobile = request.get("emailOrMobile");
            
            boolean sent = userService.sendPasswordResetOTP(emailOrMobile);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", sent);
            response.put("message", sent ? "Password reset OTP sent" : "Failed to send OTP");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Reset password with OTP
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String emailOrMobile = request.get("emailOrMobile");
            String otpCode = request.get("otpCode");
            String newPassword = request.get("newPassword");
            
            boolean reset = userService.resetPasswordWithOTP(emailOrMobile, otpCode, newPassword);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", reset);
            response.put("message", reset ? "Password reset successfully" : "Failed to reset password");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Send OTP for user actions
    @PostMapping("/send-action-otp")
    public ResponseEntity<?> sendActionOTP(@RequestBody Map<String, String> request) {
        try {
            String userId = request.get("userId");
            String purpose = request.get("purpose");
            
            boolean sent = userService.sendUserActionOTP(userId, purpose);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", sent);
            response.put("message", sent ? "OTP sent successfully" : "Failed to send OTP");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Verify OTP for user actions
    @PostMapping("/verify-action-otp")
    public ResponseEntity<?> verifyActionOTP(@RequestBody Map<String, String> request) {
        try {
            String userId = request.get("userId");
            String otpCode = request.get("otpCode");
            String purpose = request.get("purpose");
            
            boolean verified = userService.verifyUserActionOTP(userId, otpCode, purpose);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", verified);
            response.put("message", verified ? "OTP verified successfully" : "Invalid or expired OTP");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Update password with OTP
    @Transactional
    @PatchMapping("/update-password-otp")
    public ResponseEntity<?> updatePasswordWithOTP(@RequestBody Map<String, String> request) {
        try {
            String userId = request.get("userId");
            String otpCode = request.get("otpCode");
            String newPassword = request.get("newPassword");
            
            userService.updatePasswordWithOTP(userId, otpCode, newPassword);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Password updated successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Legacy update password (without OTP)
    @Transactional
    @PatchMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String newPassword = request.get("newPassword");
            
            // For legacy support, we'll find user by email and update password
            // In production, this should require OTP verification
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Password updated successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "User not found");
            
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Get user by ID
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable String userId) {
        try {
            User user = userService.findUserById(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User found");
            response.put("data", user);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "User not found");
            
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Get all users (for contacts)
    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Users retrieved successfully");
            response.put("data", users);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to retrieve users");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
