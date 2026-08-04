package com.restaurant.pos_backend.repository;

import com.restaurant.pos_backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBranchId(Long branchId);
    List<Order> findByBranchIdAndStatus(Long branchId, String status);
    List<Order> findByTableIdAndStatus(Long tableId, String status);
}
