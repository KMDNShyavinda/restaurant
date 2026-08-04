package com.restaurant.pos_backend.repository;

import com.restaurant.pos_backend.entity.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    List<Ingredient> findByBranchId(Long branchId);

    @Query("SELECT i FROM Ingredient i WHERE i.branch.id = :branchId AND i.currentStock <= i.reorderLevel")
    List<Ingredient> findLowStockIngredientsByBranchId(@Param("branchId") Long branchId);
}
