package com.restaurant.pos_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    @JsonIgnoreProperties({"restaurant", "hibernateLazyInitializer", "handler"})
    private Branch branch;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "table_id")
    @JsonIgnoreProperties({"branch", "hibernateLazyInitializer", "handler"})
    private TableEntity table;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "waiter_id")
    @JsonIgnoreProperties({"branch", "role", "passwordHash", "hibernateLazyInitializer", "handler"})
    private User waiter;

    @Column(name = "order_type", nullable = false, length = 20)
    private String orderType; // DINE_IN, TAKEAWAY, DELIVERY

    @Column(length = 20)
    @Builder.Default
    private String status = "OPEN"; // OPEN, SENT, PREPARING, SERVED, PAID, CANCELLED

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;

    @Column(name = "discount_amount", precision = 10, scale = 2)
    @Builder.Default
    private java.math.BigDecimal discountAmount = java.math.BigDecimal.ZERO;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();
}
