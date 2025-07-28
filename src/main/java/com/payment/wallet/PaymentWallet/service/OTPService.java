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

    private Map<String, OTPData> otpStorage = new ConcurrentHashMap<>();

    private boolean twilioInitialized = false;

    @PostConstruct
    public void initializeTwilio() {
        if (twilioAccountSid != null && !twilioAccountSid.trim().isEmpty() &&
                twilioAuthToken != null && !twilioAuthToken.trim().isEmpty()) {
            try {
                Twilio.init(twilioAccountSid, twilioAuthToken);
                twilioInitialized = true;
            } catch (Exception e) {
                e.printStackTrace();
                twilioInitialized = false;
            }
        }
    }

    public String generateOTP() {
        return String.format("%06d", new Random().nextInt(1000000));
    }

    public boolean sendOTP(String userId, String email, String mobile, String purpose) {
        String otpCode = generateOTP();
        OTPData otpData = new OTPData(otpCode, purpose, LocalDateTime.now().plusMinutes(5));
        otpStorage.put(userId + "_" + purpose, otpData);

        sendEmailOTP(email, otpCode, purpose);
        sendSMSOTP(mobile, otpCode, purpose);

        return true;
    }

    public boolean verifyOTP(String userId, String otpCode, String purpose) {
        String key = userId + "_" + purpose;
        OTPData otpData = otpStorage.get(key);

        if (otpData != null && otpData.getOtpCode().equals(otpCode) &&
                LocalDateTime.now().isBefore(otpData.getExpiryTime())) {
            otpStorage.remove(key);
            return true;
        }
        return false;
    }

    private boolean sendEmailOTP(String toEmail, String otpCode, String purpose) {
        try {
            if (mailSender != null && fromEmail != null && !fromEmail.trim().isEmpty()) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(toEmail);
                message.setSubject("PayWallet OTP - " + purpose);
                message.setText(buildEmailBody(otpCode, purpose));
                mailSender.send(message);
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    private boolean sendSMSOTP(String mobile, String otpCode, String purpose) {
        try {
            if (!twilioInitialized || twilioPhoneNumber == null || twilioPhoneNumber.trim().isEmpty()) return false;

            String cleanMobile = mobile.replaceAll("[^0-9]", "");
            if (cleanMobile.length() == 10) cleanMobile = "+91" + cleanMobile;
            else if (!cleanMobile.startsWith("+")) cleanMobile = "+" + cleanMobile;

            String messageBody = String.format(
                    "PayNow OTP for %s: %s. Valid for 5 minutes. Do not share it.",
                    purpose, otpCode
            );

            Message.creator(new PhoneNumber(cleanMobile), new PhoneNumber(twilioPhoneNumber), messageBody).create();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public void sendTransactionNotification(String email, String mobile, String message) {
        try {
            if (mailSender != null && fromEmail != null && !fromEmail.trim().isEmpty()) {
                SimpleMailMessage emailMsg = new SimpleMailMessage();
                emailMsg.setFrom(fromEmail);
                emailMsg.setTo(email);
                emailMsg.setSubject("PayWallet Transaction Alert");
                emailMsg.setText(message);
                mailSender.send(emailMsg);
            }

            if (twilioInitialized && twilioPhoneNumber != null && !twilioPhoneNumber.trim().isEmpty()) {
                String cleanMobile = mobile.replaceAll("[^0-9]", "");
                if (cleanMobile.length() == 10) cleanMobile = "+91" + cleanMobile;
                else if (!cleanMobile.startsWith("+")) cleanMobile = "+" + cleanMobile;

                Message.creator(new PhoneNumber(cleanMobile), new PhoneNumber(twilioPhoneNumber), message).create();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String buildEmailBody(String otpCode, String purpose) {
        return String.format(
                """
                Dear PayNow User,
    
                Your OTP for %s is: %s
    
                This OTP is valid for 5 minutes only.
                Please do not share this OTP with anyone.
    
                If you didn't request this OTP, please ignore this email.
    
                Best regards,
                PayWallet Team
                """, purpose, otpCode);
    }

    public void cleanExpiredOTPs() {
        LocalDateTime now = LocalDateTime.now();
        otpStorage.entrySet().removeIf(e -> now.isAfter(e.getValue().getExpiryTime()));
    }


    private static class OTPData {
        private final String otpCode;
        private final String purpose;
        private final LocalDateTime expiryTime;

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
