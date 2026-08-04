package com.restaurant.pos_backend.repository;

import com.restaurant.pos_backend.entity.RecipeItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RecipeItemRepository extends JpaRepository<RecipeItem, Long> {
    List<RecipeItem> findByMenuItemId(Long menuItemId);
}
