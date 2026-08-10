package com.restaurant.pos_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TableRequest {

    @NotNull(message = "Branch ID is required")
    private Long branchId;

    @NotBlank(message = "Table number is required")
    private String tableNumber;

    @NotNull(message = "Capacity is required")
    @Positive(message = "Capacity must be positive")
    private Integer capacity;

    private String zone;

    @Builder.Default
    private String status = "FREE";

    private Double positionX;
    private Double positionY;
}
