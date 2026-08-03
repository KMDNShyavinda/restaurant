package com.restaurant.pos_backend.repository;

import com.restaurant.pos_backend.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByTableBranchId(Long branchId);
    List<Reservation> findByTableBranchIdAndReservationTimeBetween(Long branchId, LocalDateTime start, LocalDateTime end);
}
