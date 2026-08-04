package com.restaurant.pos_backend.repository;

import com.restaurant.pos_backend.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByCategoryId(Long categoryId);
    List<MenuItem> findByCategoryBranchId(Long branchId);
    List<MenuItem> findByCategoryBranchIdAndIsAvailable(Long branchId, Boolean isAvailable);
}
