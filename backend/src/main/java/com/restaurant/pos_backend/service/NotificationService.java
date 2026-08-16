package com.restaurant.pos_backend.service;

import com.restaurant.pos_backend.entity.Order;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    @Value("${twilio.account.sid:}")
    private String accountSid;

    @Value("${twilio.auth.token:}")
    private String authToken;

    @Value("${twilio.phone.number:}")
    private String twilioPhoneNumber;

    private boolean isTwilioEnabled = false;

    @PostConstruct
    public void init() {
        if (accountSid != null && !accountSid.isEmpty() && authToken != null && !authToken.isEmpty()) {
            Twilio.init(accountSid, authToken);
            isTwilioEnabled = true;
            logger.info("Twilio initialized successfully with SID: {}", accountSid);
        } else {
            logger.warn("Twilio credentials are not set. SMS notifications will be mocked.");
        }
    }

    public void sendOrderAlert(Order order, String alertType) {
        if (order.getCustomer() == null || order.getCustomer().getPhone() == null || order.getCustomer().getPhone().isEmpty()) {
            logger.info("No valid phone number for order ID: {}. Skipping SMS alert.", order.getId());
            return;
        }

        String toPhoneNumber = order.getCustomer().getPhone();
        String messageBody = buildMessageBody(order, alertType);

        if (isTwilioEnabled) {
            try {
                Message message = Message.creator(
                        new PhoneNumber(toPhoneNumber),
                        new PhoneNumber(twilioPhoneNumber),
                        messageBody
                ).create();
                logger.info("Sent SMS via Twilio to {} - Message SID: {}", toPhoneNumber, message.getSid());
            } catch (Exception e) {
                logger.error("Failed to send SMS via Twilio to {}: {}", toPhoneNumber, e.getMessage());
            }
        } else {
            // Mock SMS
            logger.info("=== MOCK SMS ALERT ===");
            logger.info("To: {}", toPhoneNumber);
            logger.info("Body: {}", messageBody);
            logger.info("======================");
        }
    }

    private String buildMessageBody(Order order, String alertType) {
        String customerName = order.getCustomer().getName() != null ? order.getCustomer().getName() : "Customer";
        
        switch (alertType.toUpperCase()) {
            case "CONFIRMED":
                return String.format("Hello %s, your order #%d from Maison Ceylon has been confirmed and is being prepared!", customerName, order.getId());
            case "READY":
                return String.format("Hello %s, your order #%d is ready! Enjoy your meal from Maison Ceylon.", customerName, order.getId());
            default:
                return String.format("Hello %s, your order #%d status has been updated to %s.", customerName, order.getId(), alertType);
        }
    }
}
