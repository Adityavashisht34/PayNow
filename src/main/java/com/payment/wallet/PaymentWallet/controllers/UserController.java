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
@CrossOrigin(origins = "https://paynow-ruby.vercel.app/")
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
