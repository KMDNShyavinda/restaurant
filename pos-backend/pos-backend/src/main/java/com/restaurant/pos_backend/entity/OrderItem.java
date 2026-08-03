package com.restaurant.pos_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private Order order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "menu_item_id")
    private MenuItem menuItem;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 1;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(length = 255)
    private String notes;

    @Column(length = 20)
    @Builder.Default
    private String status = "PENDING"; // PENDING, PREPARING, READY, SERVED

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "order_item_modifiers",
        joinColumns = @JoinColumn(name = "order_item_id"),
        inverseJoinColumns = @JoinColumn(name = "modifier_id")
    )
    @Builder.Default
    private Set<Modifier> modifiers = new HashSet<>();
}
