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

        String toPhoneNumber = "whatsapp:" + order.getCustomer().getPhone();
        String fromPhoneNumber = "whatsapp:" + twilioPhoneNumber;
        String messageBody = buildMessageBody(order, alertType);

        if (isTwilioEnabled) {
            try {
                Message message = Message.creator(
                        new PhoneNumber(toPhoneNumber),
                        new PhoneNumber(fromPhoneNumber),
                        messageBody
                ).create();
                logger.info("Sent WhatsApp via Twilio to {} - Message SID: {}", toPhoneNumber, message.getSid());
            } catch (Exception e) {
                logger.error("Failed to send WhatsApp via Twilio to {}: {}", toPhoneNumber, e.getMessage());
            }
        } else {
            // Mock WhatsApp
            logger.info("=== MOCK WHATSAPP ALERT ===");
            logger.info("To: {}", toPhoneNumber);
            logger.info("From: {}", fromPhoneNumber);
            logger.info("Body: \n{}", messageBody);
            logger.info("===========================");
        }
    }

    private String buildMessageBody(Order order, String alertType) {
        String customerName = order.getCustomer().getName() != null ? order.getCustomer().getName() : "Customer";
        
        StringBuilder details = new StringBuilder();
        if (order.getItems() != null && !order.getItems().isEmpty()) {
            details.append("\n*Order Details:*\n");
            for (var item : order.getItems()) {
                details.append("- ").append(item.getMenuItem().getName())
                       .append(" x").append(item.getQuantity()).append("\n");
            }
        }
        
        String baseMessage;
        switch (alertType.toUpperCase()) {
            case "CONFIRMED":
                baseMessage = String.format("Hello %s, your order #%d from *Maison Ceylon* has been confirmed and is being prepared!", customerName, order.getId());
                break;
            case "READY":
                baseMessage = String.format("Hello %s, your order #%d is ready! Enjoy your meal.", customerName, order.getId());
                break;
            default:
                baseMessage = String.format("Hello %s, your order #%d status has been updated to %s.", customerName, order.getId(), alertType);
                break;
        }

        return baseMessage + "\n" + details.toString() + "\nThank you for choosing Maison Ceylon! We hope to serve you again soon. \uD83C\uDF7D\uFE0F";
    }
}
