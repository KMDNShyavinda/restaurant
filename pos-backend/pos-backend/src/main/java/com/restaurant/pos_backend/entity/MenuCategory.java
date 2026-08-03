package com.restaurant.pos_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "menu_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class MenuCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    @JsonIgnoreProperties({"restaurant", "hibernateLazyInitializer", "handler"})
    private Branch branch;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;
}
