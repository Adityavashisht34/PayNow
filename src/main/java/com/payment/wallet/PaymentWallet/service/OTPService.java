package com.payment.wallet.PaymentWallet.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Autowired;

import jakarta.annotation.PostConstruct;

import java.util.HashMap;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import java.util.Random;
import java.time.LocalDateTime;

@Service
public class OTPService {

    @Autowired(required = false)
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username:}")
    private String fromEmail;
    
    @Value("${twilio.account.sid:}")
    private String twilioAccountSid;
    
    @Value("${twilio.auth.token:}")
    private String twilioAuthToken;
    
    @Value("${twilio.phone.number:}")
    private String twilioPhoneNumber;

    private Map<String, OTPData> otpStorage = new HashMap<>();

    private boolean twilioInitialized = false;

    @PostConstruct
    public void initializeTwilio() {
        if (twilioAccountSid != null && !twilioAccountSid.trim().isEmpty() && 
            twilioAuthToken != null && !twilioAuthToken.trim().isEmpty()) {
            try {
                System.out.println("🔧 Initializing Twilio...");
                System.out.println("📱 Account SID: " + twilioAccountSid.substring(0, 10) + "...");
                System.out.println("🔑 Auth Token: " + twilioAuthToken.substring(0, 10) + "...");
                System.out.println("📞 Phone Number: " + twilioPhoneNumber);
                
                Twilio.init(twilioAccountSid, twilioAuthToken);
                twilioInitialized = true;
                System.out.println("✅ Twilio initialized successfully");
            } catch (Exception e) {
                System.err.println("❌ Failed to initialize Twilio: " + e.getMessage());
                e.printStackTrace();
                twilioInitialized = false;
            }
        } else {
            System.out.println("⚠️ Twilio credentials not configured - SMS will be simulated");
            twilioInitialized = false;
        }
    }

    // Generate 6-digit OTP
    public String generateOTP() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    // Send OTP via email and SMS
    public boolean sendOTP(String userId, String email, String mobile, String purpose) {
        String otpCode = generateOTP();
        
        // Store OTP with 5-minute expiry
        OTPData otpData = new OTPData(otpCode, purpose, LocalDateTime.now().plusMinutes(5));
        String key = userId + "_" + purpose;
        otpStorage.put(key, otpData);
        
        System.out.println("🔐 Generated OTP for " + userId + " (" + purpose + "): " + otpCode);
        System.out.println("📧 Email: " + email + " | 📱 Mobile: " + mobile);
        
        // Send via email
        boolean emailSent = sendEmailOTP(email, otpCode, purpose);
        
        // Send via SMS
        boolean smsSent = sendSMSOTP(mobile, otpCode, purpose);
        
        // Always log OTP for testing
        System.out.println("🎯 TEST OTP: " + otpCode + " (Valid for 5 minutes)");
        
        return true; // Always return true for demo purposes
    }

    // Verify OTP
    public boolean verifyOTP(String userId, String otpCode, String purpose) {
        String key = userId + "_" + purpose;
        OTPData otpData = otpStorage.get(key);
        
        System.out.println("🔍 Verifying OTP for key: " + key);
        System.out.println("🔍 Provided OTP: " + otpCode);
        
        if (otpData != null) {
            System.out.println("🔍 Stored OTP: " + otpData.getOtpCode());
            System.out.println("🔍 Expiry: " + otpData.getExpiryTime());
            System.out.println("🔍 Current time: " + LocalDateTime.now());
            System.out.println("🔍 Is expired: " + LocalDateTime.now().isAfter(otpData.getExpiryTime()));
            
            if (otpData.getOtpCode().equals(otpCode) && 
                LocalDateTime.now().isBefore(otpData.getExpiryTime())) {
                
                // Remove OTP after successful verification
                otpStorage.remove(key);
                System.out.println("✅ OTP verified successfully");
                return true;
            } else {
                System.out.println("❌ OTP verification failed - code mismatch or expired");
            }
        } else {
            System.out.println("❌ No OTP found for key: " + key);
            System.out.println("📋 Available keys: " + otpStorage.keySet());
        }
        
        return false;
    }

    // Send email OTP
    private boolean sendEmailOTP(String toEmail, String otpCode, String purpose) {
        try {
            if (mailSender != null && fromEmail != null && !fromEmail.trim().isEmpty()) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(toEmail);
                message.setSubject("PayWallet OTP - " + purpose);
                message.setText(buildEmailBody(otpCode, purpose));
                
                mailSender.send(message);
                System.out.println("✅ Email OTP sent to: " + toEmail + " | OTP: " + otpCode);
                return true;
            } else {
                System.out.println("📧 DEMO EMAIL OTP for " + toEmail + ": " + otpCode);
                return true;
            }
        } catch (Exception e) {
            System.err.println("❌ Failed to send email OTP: " + e.getMessage());
            System.out.println("📧 FALLBACK EMAIL OTP for " + toEmail + ": " + otpCode);
            return false;
        }
    }

    // Send SMS OTP with improved error handling
    private boolean sendSMSOTP(String mobile, String otpCode, String purpose) {
        try {
            if (twilioInitialized && twilioPhoneNumber != null && !twilioPhoneNumber.trim().isEmpty()) {
                // Clean and format mobile number
                String cleanMobile = mobile.replaceAll("[^0-9+]", "");
                
                // Add country code if not present
                if (!cleanMobile.startsWith("+")) {
                    if (cleanMobile.length() == 10) {
                        cleanMobile = "+1" + cleanMobile; // US number
                    } else if (cleanMobile.length() == 11 && cleanMobile.startsWith("1")) {
                        cleanMobile = "+" + cleanMobile; // US number with 1
                    } else {
                        cleanMobile = "+1" + cleanMobile; // Default to US
                    }
                }
                
                System.out.println("📱 Sending SMS to: " + cleanMobile);
                System.out.println("📱 From number: " + twilioPhoneNumber);
                
                String messageBody = String.format(
                    "PayWallet OTP for %s: %s. Valid for 5 minutes. Do not share with anyone.",
                    purpose, otpCode
                );
                
                // Create message using Twilio API
                Message message = Message.creator(
                    new PhoneNumber(cleanMobile),
                    new PhoneNumber(twilioPhoneNumber),
                    messageBody
                ).create();
                
                System.out.println("✅ SMS OTP sent successfully!");
                System.out.println("📱 To: " + cleanMobile);
                System.out.println("📱 SID: " + message.getSid());
                System.out.println("📱 Status: " + message.getStatus());
                System.out.println("📱 OTP: " + otpCode);
                
                return true;
            } else {
                System.out.println("📱 DEMO SMS OTP for " + mobile + ": " + otpCode);
                System.out.println("⚠️ Twilio not configured - using demo mode");
                return true;
            }
        } catch (com.twilio.exception.AuthenticationException e) {
            System.err.println("❌ Twilio Authentication Error: " + e.getMessage());
            System.err.println("🔧 Check your Twilio Account SID and Auth Token");
            System.out.println("📱 FALLBACK SMS OTP for " + mobile + ": " + otpCode);
            return false;
        } catch (com.twilio.exception.ApiException e) {
            System.err.println("❌ Twilio API Error: " + e.getMessage());
            System.err.println("📱 Error Code: " + e.getCode());
            System.out.println("📱 FALLBACK SMS OTP for " + mobile + ": " + otpCode);
            return false;
        } catch (Exception e) {
            System.err.println("❌ Failed to send SMS OTP: " + e.getMessage());
            e.printStackTrace();
            System.out.println("📱 FALLBACK SMS OTP for " + mobile + ": " + otpCode);
            return false;
        }
    }

    // Send transaction notification
    public void sendTransactionNotification(String email, String mobile, String message) {
        try {
            // Send email notification
            if (mailSender != null && fromEmail != null && !fromEmail.trim().isEmpty()) {
                SimpleMailMessage emailMessage = new SimpleMailMessage();
                emailMessage.setFrom(fromEmail);
                emailMessage.setTo(email);
                emailMessage.setSubject("PayWallet Transaction Alert");
                emailMessage.setText(message);
                mailSender.send(emailMessage);
                System.out.println("✅ Transaction email sent to: " + email);
            }
            
            // Send SMS notification
            if (twilioInitialized && twilioPhoneNumber != null && !twilioPhoneNumber.trim().isEmpty()) {
                String cleanMobile = mobile.replaceAll("[^0-9+]", "");
                if (!cleanMobile.startsWith("+")) {
                    cleanMobile = "+1" + cleanMobile;
                }
                
                Message smsMessage = Message.creator(
                    new PhoneNumber(cleanMobile),
                    new PhoneNumber(twilioPhoneNumber),
                    message
                ).create();
                
                System.out.println("✅ Transaction SMS sent to: " + cleanMobile + " | SID: " + smsMessage.getSid());
            } else {
                System.out.println("📱 Transaction SMS to " + mobile + ": " + message);
            }
            
        } catch (Exception e) {
            System.err.println("❌ Failed to send transaction notification: " + e.getMessage());
            System.out.println("📧📱 DEMO Transaction notification to " + email + "/" + mobile + ": " + message);
        }
    }

    private String buildEmailBody(String otpCode, String purpose) {
        return String.format("""
            Dear PayWallet User,
            
            Your OTP for %s is: %s
            
            This OTP is valid for 5 minutes only.
            Please do not share this OTP with anyone.
            
            If you didn't request this OTP, please ignore this email.
            
            Best regards,
            PayWallet Team
            
            ---
            This is an automated message from PayWallet.
            """, purpose, otpCode);
    }

    // Clean expired OTPs (call this periodically)
    public void cleanExpiredOTPs() {
        LocalDateTime now = LocalDateTime.now();
        otpStorage.entrySet().removeIf(entry -> now.isAfter(entry.getValue().getExpiryTime()));
        System.out.println("🧹 Cleaned expired OTPs. Remaining: " + otpStorage.size());
    }

    // Get all stored OTPs (for debugging)
    public void debugOTPs() {
        System.out.println("🔍 DEBUG - Current OTPs in storage:");
        otpStorage.forEach((key, data) -> {
            System.out.println("  Key: " + key + " | OTP: " + data.getOtpCode() + " | Expires: " + data.getExpiryTime());
        });
    }

    // Inner class for OTP data
    private static class OTPData {
        private String otpCode;
        private String purpose;
        private LocalDateTime expiryTime;

        public OTPData(String otpCode, String purpose, LocalDateTime expiryTime) {
            this.otpCode = otpCode;
            this.purpose = purpose;
            this.expiryTime = expiryTime;
        }

        public String getOtpCode() { return otpCode; }
        public String getPurpose() { return purpose; }
        public LocalDateTime getExpiryTime() { return expiryTime; }
    }
}