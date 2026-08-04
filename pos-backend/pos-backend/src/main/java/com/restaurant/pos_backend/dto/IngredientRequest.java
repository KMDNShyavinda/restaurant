package com.restaurant.pos_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngredientRequest {

    @NotNull(message = "Branch ID is required")
    private Long branchId;

    @NotBlank(message = "Ingredient name is required")
    private String name;

    @NotBlank(message = "Unit is required (e.g. kg, l, pcs)")
    private String unit;

    @NotNull(message = "Current stock is required")
    @PositiveOrZero(message = "Current stock must be non-negative")
    private BigDecimal currentStock;

    @NotNull(message = "Reorder level is required")
    @PositiveOrZero(message = "Reorder level must be non-negative")
    private BigDecimal reorderLevel;
}
