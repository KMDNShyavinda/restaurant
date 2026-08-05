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

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.restaurant.pos_backend.security.CustomUserDetails;
import com.restaurant.pos_backend.entity.Customer;
import com.restaurant.pos_backend.repository.CustomerRepository;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping
    @PreAuthorize("hasRole('CUSTOMER') or hasAuthority('orders:read') or hasRole('WAITER') or hasRole('CASHIER') or hasRole('MANAGER') or hasRole('OWNER') or hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getOrders(
            @RequestParam(defaultValue = "1") Long branchId,
            @RequestParam(required = false) String status,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        
        List<Order> orders = orderService.getOrders(branchId, status);
        
        if ("CUSTOMER".equals(userDetails.getRoleName())) {
            // Filter orders only for this customer
            Customer customer = customerRepository.findByEmail(userDetails.getUsername()).orElse(null);
            if (customer != null) {
                orders = orders.stream().filter(o -> o.getCustomer() != null && o.getCustomer().getId().equals(customer.getId())).toList();
            } else {
                orders = List.of(); // No customer profile means no orders
            }
        }
        
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER') or hasAuthority('orders:create') or hasRole('WAITER') or hasRole('CASHIER') or hasRole('MANAGER') or hasRole('OWNER')")
    public ResponseEntity<Order> createOrder(@Valid @RequestBody OrderCreateRequest request, @AuthenticationPrincipal CustomUserDetails userDetails) {
        if ("CUSTOMER".equals(userDetails.getRoleName())) {
            Customer customer = customerRepository.findByEmail(userDetails.getUsername()).orElse(null);
            if (customer != null) {
                request.setCustomerId(customer.getId());
            }
        }
        Order order = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @PostMapping("/{id}/items")
    @PreAuthorize("hasRole('CUSTOMER') or hasAuthority('orders:create') or hasRole('WAITER') or hasRole('CASHIER') or hasRole('MANAGER') or hasRole('OWNER')")
    public ResponseEntity<Order> addItemsToOrder(
            @PathVariable Long id,
            @Valid @RequestBody List<OrderItemRequest> itemRequests) {
        Order order = orderService.addItemsToOrder(id, itemRequests);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/{id}/send-to-kitchen")
    @PreAuthorize("hasRole('CUSTOMER') or hasAuthority('orders:create') or hasRole('WAITER') or hasRole('CASHIER') or hasRole('MANAGER') or hasRole('OWNER')")
    public ResponseEntity<Order> sendToKitchen(@PathVariable Long id) {
        Order order = orderService.sendToKitchen(id);
        return ResponseEntity.ok(order);
    }
}
