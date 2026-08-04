package com.restaurant.pos_backend.repository;

import com.restaurant.pos_backend.entity.KitchenTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface KitchenTicketRepository extends JpaRepository<KitchenTicket, Long> {
    List<KitchenTicket> findByStationAndStatusNot(String station, String status);
    List<KitchenTicket> findByStatusNot(String status);
    List<KitchenTicket> findByOrderId(Long orderId);
}
