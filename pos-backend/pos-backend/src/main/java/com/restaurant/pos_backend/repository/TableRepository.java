package com.restaurant.pos_backend.repository;

import com.restaurant.pos_backend.entity.TableEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TableRepository extends JpaRepository<TableEntity, Long> {
    List<TableEntity> findByBranchId(Long branchId);
    List<TableEntity> findByBranchIdAndStatus(Long branchId, String status);
    List<TableEntity> findByBranchIdAndZone(Long branchId, String zone);
}
