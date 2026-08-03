package com.restaurant.pos_backend.controller;

import com.restaurant.pos_backend.dto.OrderCreateRequest;
import com.restaurant.pos_backend.dto.OrderItemRequest;
import com.restaurant.pos_backend.entity.Order;
import com.restaurant.pos_backend.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<List<Order>> getOrders(
            @RequestParam(defaultValue = "1") Long branchId,
            @RequestParam(required = false) String status) {
        List<Order> orders = orderService.getOrders(branchId, status);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('orders:create') or hasRole('WAITER') or hasRole('CASHIER') or hasRole('MANAGER') or hasRole('OWNER')")
    public ResponseEntity<Order> createOrder(@Valid @RequestBody OrderCreateRequest request) {
        Order order = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @PostMapping("/{id}/items")
    @PreAuthorize("hasAuthority('orders:create') or hasRole('WAITER') or hasRole('CASHIER') or hasRole('MANAGER') or hasRole('OWNER')")
    public ResponseEntity<Order> addItemsToOrder(
            @PathVariable Long id,
            @Valid @RequestBody List<OrderItemRequest> itemRequests) {
        Order order = orderService.addItemsToOrder(id, itemRequests);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/{id}/send-to-kitchen")
    @PreAuthorize("hasAuthority('orders:create') or hasRole('WAITER') or hasRole('CASHIER') or hasRole('MANAGER') or hasRole('OWNER')")
    public ResponseEntity<Order> sendToKitchen(@PathVariable Long id) {
        Order order = orderService.sendToKitchen(id);
        return ResponseEntity.ok(order);
    }
}
