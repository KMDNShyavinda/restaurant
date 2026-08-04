package com.restaurant.pos_backend.repository;

import com.restaurant.pos_backend.entity.StockAdjustment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StockAdjustmentRepository extends JpaRepository<StockAdjustment, Long> {
    List<StockAdjustment> findByBranchId(Long branchId);
    List<StockAdjustment> findByIngredientId(Long ingredientId);
}
