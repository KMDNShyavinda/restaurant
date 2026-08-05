package com.restaurant.pos_backend.repository;

import com.restaurant.pos_backend.entity.DishRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DishRatingRepository extends JpaRepository<DishRating, Long> {
    
    @Query("SELECT AVG(d.rating) FROM DishRating d WHERE d.menuItem.id = :menuItemId")
    Double getAverageRatingForMenuItem(@Param("menuItemId") Long menuItemId);
    
    @Query("SELECT COUNT(d) FROM DishRating d WHERE d.menuItem.id = :menuItemId")
    Long getRatingCountForMenuItem(@Param("menuItemId") Long menuItemId);
    
    List<DishRating> findByMenuItemId(Long menuItemId);
}
