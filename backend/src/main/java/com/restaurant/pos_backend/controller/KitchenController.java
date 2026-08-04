package com.restaurant.pos_backend.controller;

import com.restaurant.pos_backend.entity.KitchenTicket;
import com.restaurant.pos_backend.service.KitchenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kitchen")
@CrossOrigin(origins = "*")
public class KitchenController {

    @Autowired
    private KitchenService kitchenService;

    @GetMapping("/tickets")
    public ResponseEntity<List<KitchenTicket>> getActiveTickets(@RequestParam(required = false) String station) {
        List<KitchenTicket> tickets = kitchenService.getActiveTickets(station);
        return ResponseEntity.ok(tickets);
    }

    @PatchMapping("/tickets/{id}/status")
    @PreAuthorize("hasAuthority('kitchen:manage') or hasRole('KITCHEN') or hasRole('MANAGER') or hasRole('OWNER')")
    public ResponseEntity<KitchenTicket> updateTicketStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        KitchenTicket ticket = kitchenService.updateTicketStatus(id, status);
        return ResponseEntity.ok(ticket);
    }
}
