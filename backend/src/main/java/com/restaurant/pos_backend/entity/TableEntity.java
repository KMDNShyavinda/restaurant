package com.restaurant.pos_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tables")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class TableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    @JsonIgnoreProperties({"restaurant", "hibernateLazyInitializer", "handler"})
    private Branch branch;

    @Column(name = "table_number", nullable = false, length = 10)
    private String tableNumber;

    private Integer capacity;

    @Column(length = 50)
    private String zone;

    @Column(length = 20)
    @Builder.Default
    private String status = "FREE"; // FREE, OCCUPIED, RESERVED
}
