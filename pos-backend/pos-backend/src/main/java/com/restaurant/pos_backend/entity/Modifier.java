package com.restaurant.pos_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "modifiers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Modifier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "modifier_group_id")
    @JsonIgnore
    private ModifierGroup modifierGroup;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "extra_price", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal extraPrice = BigDecimal.ZERO;
}
