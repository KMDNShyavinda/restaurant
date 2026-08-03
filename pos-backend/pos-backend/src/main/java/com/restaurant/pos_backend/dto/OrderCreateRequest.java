package com.restaurant.pos_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderCreateRequest {

    @NotNull(message = "Branch ID is required")
    private Long branchId;

    private Long tableId;
    private Long customerId;
    private Long waiterId;

    @NotBlank(message = "Order type is required (DINE_IN, TAKEAWAY, DELIVERY)")
    private String orderType;
}
