package com.restaurant.pos_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "recipe_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class RecipeItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_item_id")
    @JsonIgnore
    private MenuItem menuItem;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ingredient_id")
    private Ingredient ingredient;

    @Column(name = "quantity_used", nullable = false, precision = 10, scale = 3)
    private BigDecimal quantityUsed;
}
