package com.restaurant.pos_backend.service;

import com.restaurant.pos_backend.entity.KitchenTicket;
import com.restaurant.pos_backend.entity.Order;
import com.restaurant.pos_backend.repository.KitchenTicketRepository;
import com.restaurant.pos_backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class KitchenService {

    @Autowired
    private KitchenTicketRepository kitchenTicketRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public List<KitchenTicket> getActiveTickets(String station) {
        if (station != null) {
            return kitchenTicketRepository.findByStationAndStatusNot(station.toUpperCase(), "COMPLETED");
        }
        return kitchenTicketRepository.findByStatusNot("COMPLETED");
    }

    @Transactional
    public KitchenTicket updateTicketStatus(Long ticketId, String status) {
        KitchenTicket ticket = kitchenTicketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Kitchen ticket not found with ID: " + ticketId));

        ticket.setStatus(status.toUpperCase());
        KitchenTicket updatedTicket = kitchenTicketRepository.save(ticket);

        Order order = ticket.getOrder();
        
        // Update corresponding Order items based on ticket status
        if ("PREPARING".equalsIgnoreCase(status)) {
            order.getItems().forEach(item -> {
                if (ticket.getStation().equalsIgnoreCase(item.getMenuItem().getStation())) {
                    item.setStatus("PREPARING");
                }
            });
            if ("OPEN".equals(order.getStatus()) || "SENT".equals(order.getStatus())) {
                order.setStatus("PREPARING");
            }
        }
        
        if ("READY".equalsIgnoreCase(status) || "COMPLETED".equalsIgnoreCase(status)) {
            order.getItems().forEach(item -> {
                if (ticket.getStation().equalsIgnoreCase(item.getMenuItem().getStation())) {
                    item.setStatus("READY");
                }
            });
            
            // Check if ALL items are ready
            boolean allReady = order.getItems().stream()
                    .allMatch(item -> "READY".equalsIgnoreCase(item.getStatus()) || "DELIVERED".equalsIgnoreCase(item.getStatus()));
                    
            if (allReady) {
                order.setStatus("READY");
            } else if ("OPEN".equals(order.getStatus()) || "SENT".equals(order.getStatus())) {
                order.setStatus("PREPARING"); // At least one ticket is ready, so order is preparing
            }
        }
        
        orderRepository.save(order);

        // Broadcast STOMP WebSocket push to all KDS clients & POS terminals
        messagingTemplate.convertAndSend("/topic/kitchen/tickets", updatedTicket);
        messagingTemplate.convertAndSend("/topic/orders/" + order.getId(), order);

        return updatedTicket;
    }
}
