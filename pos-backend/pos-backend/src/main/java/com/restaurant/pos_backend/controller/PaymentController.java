package com.restaurant.pos_backend.controller;

import com.restaurant.pos_backend.dto.PaymentRequest;
import com.restaurant.pos_backend.entity.Invoice;
import com.restaurant.pos_backend.entity.Payment;
import com.restaurant.pos_backend.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/{orderId}/payments")
    @PreAuthorize("hasAuthority('payments:process') or hasRole('CASHIER') or hasRole('MANAGER') or hasRole('OWNER')")
    public ResponseEntity<Payment> processPayment(
            @PathVariable Long orderId,
            @Valid @RequestBody PaymentRequest request) {
        Payment payment = paymentService.processPayment(orderId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(payment);
    }

    @GetMapping("/{orderId}/payments")
    public ResponseEntity<List<Payment>> getPaymentsByOrder(@PathVariable Long orderId) {
        List<Payment> payments = paymentService.getPaymentsByOrder(orderId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/{orderId}/invoice")
    public ResponseEntity<Invoice> getInvoice(@PathVariable Long orderId) {
        Invoice invoice = paymentService.getInvoiceByOrder(orderId);
        return ResponseEntity.ok(invoice);
    }
}
