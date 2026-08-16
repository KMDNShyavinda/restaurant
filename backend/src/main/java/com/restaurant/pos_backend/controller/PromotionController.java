package com.restaurant.pos_backend.controller;

import com.restaurant.pos_backend.entity.Promotion;
import com.restaurant.pos_backend.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin(origins = "*")
public class PromotionController {

    @Autowired
    private PromotionRepository promotionRepository;

    @GetMapping("/{code}")
    @PreAuthorize("hasRole('CUSTOMER') or hasAuthority('orders:create') or hasRole('WAITER') or hasRole('CASHIER') or hasRole('MANAGER') or hasRole('OWNER')")
    public ResponseEntity<Promotion> getPromotionByCode(@PathVariable String code) {
        return promotionRepository.findByCode(code.toUpperCase())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
