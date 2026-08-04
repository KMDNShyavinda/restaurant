package com.restaurant.pos_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "ingredients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    @JsonIgnoreProperties({"restaurant", "hibernateLazyInitializer", "handler"})
    private Branch branch;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 20)
    private String unit; // kg, l, pcs

    @Column(name = "current_stock", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal currentStock = BigDecimal.ZERO;

    @Column(name = "reorder_level", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal reorderLevel = BigDecimal.ZERO;
}
