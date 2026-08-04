package com.restaurant.pos_backend.repository;

import com.restaurant.pos_backend.entity.ModifierGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModifierGroupRepository extends JpaRepository<ModifierGroup, Long> {
}
