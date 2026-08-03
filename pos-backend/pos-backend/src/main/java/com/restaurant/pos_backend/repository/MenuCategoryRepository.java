package com.restaurant.pos_backend.repository;

import com.restaurant.pos_backend.entity.MenuCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MenuCategoryRepository extends JpaRepository<MenuCategory, Long> {
    List<MenuCategory> findByBranchIdOrderBySortOrderAsc(Long branchId);
}
