package com.restaurant.pos_backend.service;

import com.restaurant.pos_backend.dto.IngredientRequest;
import com.restaurant.pos_backend.dto.StockAdjustmentRequest;
import com.restaurant.pos_backend.entity.Branch;
import com.restaurant.pos_backend.entity.Ingredient;
import com.restaurant.pos_backend.entity.StockAdjustment;
import com.restaurant.pos_backend.entity.User;
import com.restaurant.pos_backend.repository.BranchRepository;
import com.restaurant.pos_backend.repository.IngredientRepository;
import com.restaurant.pos_backend.repository.StockAdjustmentRepository;
import com.restaurant.pos_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class InventoryService {

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private StockAdjustmentRepository stockAdjustmentRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Ingredient> getIngredients(Long branchId) {
        return ingredientRepository.findByBranchId(branchId);
    }

    public List<Ingredient> getLowStockIngredients(Long branchId) {
        return ingredientRepository.findLowStockIngredientsByBranchId(branchId);
    }

    public Ingredient getIngredientById(Long id) {
        return ingredientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ingredient not found with ID: " + id));
    }

    @Transactional
    public Ingredient createIngredient(IngredientRequest request) {
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new RuntimeException("Branch not found with ID: " + request.getBranchId()));

        Ingredient ingredient = Ingredient.builder()
                .branch(branch)
                .name(request.getName())
                .unit(request.getUnit())
                .currentStock(request.getCurrentStock())
                .reorderLevel(request.getReorderLevel())
                .build();

        return ingredientRepository.save(ingredient);
    }

    @Transactional
    public Ingredient updateIngredient(Long id, IngredientRequest request) {
        Ingredient ingredient = getIngredientById(id);

        ingredient.setName(request.getName());
        ingredient.setUnit(request.getUnit());
        ingredient.setCurrentStock(request.getCurrentStock());
        ingredient.setReorderLevel(request.getReorderLevel());

        return ingredientRepository.save(ingredient);
    }

    @Transactional
    public StockAdjustment recordAdjustment(StockAdjustmentRequest request) {
        Ingredient ingredient = getIngredientById(request.getIngredientId());

        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new RuntimeException("Branch not found with ID: " + request.getBranchId()));

        User recordedBy = null;
        if (request.getRecordedById() != null) {
            recordedBy = userRepository.findById(request.getRecordedById()).orElse(null);
        }

        String type = request.getType().toUpperCase();
        BigDecimal qty = request.getQuantity();

        // Stock Calculation according to adjustment type
        if ("RECEIVED".equals(type)) {
            ingredient.setCurrentStock(ingredient.getCurrentStock().add(qty));
        } else if ("WASTAGE".equals(type)) {
            ingredient.setCurrentStock(ingredient.getCurrentStock().subtract(qty).max(BigDecimal.ZERO));
        } else if ("CORRECTION".equals(type)) {
            ingredient.setCurrentStock(qty);
        } else {
            throw new RuntimeException("Invalid adjustment type: " + type + ". Allowed: RECEIVED, WASTAGE, CORRECTION");
        }

        ingredientRepository.save(ingredient);

        StockAdjustment adjustment = StockAdjustment.builder()
                .ingredient(ingredient)
                .branch(branch)
                .type(type)
                .quantity(qty)
                .reason(request.getReason())
                .recordedBy(recordedBy)
                .build();

        return stockAdjustmentRepository.save(adjustment);
    }
}
