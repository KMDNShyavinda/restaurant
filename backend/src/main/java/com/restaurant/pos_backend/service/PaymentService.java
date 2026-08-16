package com.restaurant.pos_backend.service;

import com.restaurant.pos_backend.dto.PaymentRequest;
import com.restaurant.pos_backend.entity.*;
import com.restaurant.pos_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private TableRepository tableRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RecipeItemRepository recipeItemRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public List<Payment> getPaymentsByOrder(Long orderId) {
        return paymentRepository.findByOrderId(orderId);
    }

    public Invoice getInvoiceByOrder(Long orderId) {
        return invoiceRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Invoice not found for Order ID: " + orderId));
    }

    @Transactional
    public Payment processPayment(Long orderId, PaymentRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        if ("PAID".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Order ID " + orderId + " is already paid");
        }

        User processedBy = null;
        if (request.getProcessedById() != null) {
            processedBy = userRepository.findById(request.getProcessedById()).orElse(null);
        }

        // 1. Record Payment
        Payment payment = Payment.builder()
                .order(order)
                .method(request.getMethod().toUpperCase())
                .amount(request.getAmount())
                .status("COMPLETED")
                .transactionRef(request.getTransactionRef())
                .cashGiven(request.getCashGiven())
                .changeAmount(request.getChangeAmount())
                .processedBy(processedBy)
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        // 2. Mark Order as PAID
        order.setStatus("PAID");
        orderRepository.save(order);

        // 3. Free Table if DINE_IN order
        if (order.getTable() != null) {
            TableEntity table = order.getTable();
            table.setStatus("FREE");
            tableRepository.save(table);
        }

        // 4. Automated BOM Recipe Stock Deduction
        for (OrderItem item : order.getItems()) {
            List<RecipeItem> recipes = recipeItemRepository.findByMenuItemId(item.getMenuItem().getId());
            for (RecipeItem recipe : recipes) {
                Ingredient ingredient = recipe.getIngredient();
                BigDecimal totalDeduction = recipe.getQuantityUsed()
                        .multiply(BigDecimal.valueOf(item.getQuantity()));

                BigDecimal newStock = ingredient.getCurrentStock().subtract(totalDeduction);
                ingredient.setCurrentStock(newStock.max(BigDecimal.ZERO));
                ingredientRepository.save(ingredient);
            }
        }

        // 5. Generate Invoice
        generateInvoice(order);

        // 6. Push Live WebSocket Updates
        messagingTemplate.convertAndSend("/topic/orders/" + orderId, order);

        return savedPayment;
    }

    private Invoice generateInvoice(Order order) {
        Optional<Invoice> existing = invoiceRepository.findByOrderId(order.getId());
        if (existing.isPresent()) {
            return existing.get();
        }

        BigDecimal subtotal = order.getItems().stream()
                .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Default 10% tax for demonstration
        BigDecimal taxTotal = subtotal.multiply(new BigDecimal("0.10"));
        BigDecimal grandTotal = subtotal.add(taxTotal);

        String invoiceNo = "INV-" + DateTimeFormatter.ofPattern("yyyyMMdd").format(LocalDateTime.now()) + "-" + String.format("%05d", order.getId());

        Invoice invoice = Invoice.builder()
                .order(order)
                .invoiceNumber(invoiceNo)
                .total(grandTotal)
                .taxTotal(taxTotal)
                .discountTotal(BigDecimal.ZERO)
                .build();

        return invoiceRepository.save(invoice);
    }
}
