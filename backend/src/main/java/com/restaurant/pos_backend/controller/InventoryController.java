package com.restaurant.pos_backend.controller;

import com.restaurant.pos_backend.dto.IngredientRequest;
import com.restaurant.pos_backend.dto.StockAdjustmentRequest;
import com.restaurant.pos_backend.entity.Ingredient;
import com.restaurant.pos_backend.entity.StockAdjustment;
import com.restaurant.pos_backend.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @GetMapping("/ingredients")
    public ResponseEntity<List<Ingredient>> getIngredients(@RequestParam(defaultValue = "1") Long branchId) {
        List<Ingredient> ingredients = inventoryService.getIngredients(branchId);
        return ResponseEntity.ok(ingredients);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<Ingredient>> getLowStockIngredients(@RequestParam(defaultValue = "1") Long branchId) {
        List<Ingredient> lowStock = inventoryService.getLowStockIngredients(branchId);
        return ResponseEntity.ok(lowStock);
    }

    @PostMapping("/ingredients")
    @PreAuthorize("hasAuthority('inventory:manage') or hasRole('MANAGER') or hasRole('OWNER')")
    public ResponseEntity<Ingredient> createIngredient(@Valid @RequestBody IngredientRequest request) {
        Ingredient ingredient = inventoryService.createIngredient(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ingredient);
    }

    @PutMapping("/ingredients/{id}")
    @PreAuthorize("hasAuthority('inventory:manage') or hasRole('MANAGER') or hasRole('OWNER')")
    public ResponseEntity<Ingredient> updateIngredient(@PathVariable Long id, @Valid @RequestBody IngredientRequest request) {
        Ingredient ingredient = inventoryService.updateIngredient(id, request);
        return ResponseEntity.ok(ingredient);
    }

    @PostMapping("/stock-adjustments")
    @PreAuthorize("hasAuthority('inventory:manage') or hasRole('MANAGER') or hasRole('OWNER')")
    public ResponseEntity<StockAdjustment> recordAdjustment(@Valid @RequestBody StockAdjustmentRequest request) {
        StockAdjustment adjustment = inventoryService.recordAdjustment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(adjustment);
    }
}
