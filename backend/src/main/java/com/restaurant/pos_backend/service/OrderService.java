package com.restaurant.pos_backend.service;

import com.restaurant.pos_backend.dto.OrderCreateRequest;
import com.restaurant.pos_backend.dto.OrderItemRequest;
import com.restaurant.pos_backend.entity.*;
import com.restaurant.pos_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private TableRepository tableRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private ModifierRepository modifierRepository;

    @Autowired
    private KitchenTicketRepository kitchenTicketRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public List<Order> getOrders(Long branchId, String status) {
        if (status != null) {
            return orderRepository.findByBranchIdAndStatus(branchId, status);
        }
        return orderRepository.findByBranchId(branchId);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));
    }

    @Transactional
    public Order createOrder(OrderCreateRequest request) {
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new RuntimeException("Branch not found with ID: " + request.getBranchId()));

        TableEntity table = null;
        if (request.getTableId() != null) {
            table = tableRepository.findById(request.getTableId())
                    .orElseThrow(() -> new RuntimeException("Table not found with ID: " + request.getTableId()));
            
            // Mark table as OCCUPIED for dine-in orders
            table.setStatus("OCCUPIED");
            tableRepository.save(table);
        }

        Customer customer = null;
        if (request.getCustomerId() != null) {
            customer = customerRepository.findById(request.getCustomerId()).orElse(null);
        }

        User waiter = null;
        if (request.getWaiterId() != null) {
            waiter = userRepository.findById(request.getWaiterId()).orElse(null);
        }

        Order order = Order.builder()
                .branch(branch)
                .table(table)
                .customer(customer)
                .waiter(waiter)
                .orderType(request.getOrderType().toUpperCase())
                .status("OPEN")
                .build();

        return orderRepository.save(order);
    }

    @Transactional
    public Order addItemsToOrder(Long orderId, List<OrderItemRequest> itemRequests) {
        Order order = getOrderById(orderId);

        for (OrderItemRequest req : itemRequests) {
            MenuItem menuItem = menuItemRepository.findById(req.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("Menu item not found with ID: " + req.getMenuItemId()));

            Set<Modifier> modifiers = new HashSet<>();
            BigDecimal extraPriceSum = BigDecimal.ZERO;

            if (req.getModifierIds() != null && !req.getModifierIds().isEmpty()) {
                modifiers.addAll(modifierRepository.findAllById(req.getModifierIds()));
                extraPriceSum = modifiers.stream()
                        .map(Modifier::getExtraPrice)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
            }

            BigDecimal unitPrice = menuItem.getPrice().add(extraPriceSum);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .menuItem(menuItem)
                    .quantity(req.getQuantity())
                    .unitPrice(unitPrice)
                    .notes(req.getNotes())
                    .status("PENDING")
                    .modifiers(modifiers)
                    .build();

            order.getItems().add(orderItem);
        }

        Order updatedOrder = orderRepository.save(order);

        // Send WebSocket update to POS screens
        messagingTemplate.convertAndSend("/topic/orders/" + orderId, updatedOrder);

        return updatedOrder;
    }

    @Transactional
    public Order sendToKitchen(Long orderId) {
        Order order = getOrderById(orderId);

        if (order.getItems().isEmpty()) {
            throw new RuntimeException("Cannot send empty order to kitchen");
        }

        // Group pending items by station (KITCHEN / BAR)
        Set<String> stations = order.getItems().stream()
                .filter(item -> "PENDING".equalsIgnoreCase(item.getStatus()))
                .map(item -> item.getMenuItem().getStation() != null ? item.getMenuItem().getStation() : "KITCHEN")
                .collect(Collectors.toSet());

        List<KitchenTicket> createdTickets = new ArrayList<>();

        for (String station : stations) {
            KitchenTicket ticket = KitchenTicket.builder()
                    .order(order)
                    .station(station)
                    .printedAt(LocalDateTime.now())
                    .status("QUEUED")
                    .build();

            createdTickets.add(kitchenTicketRepository.save(ticket));
        }

        // Update item statuses to PREPARING
        order.getItems().forEach(item -> {
            if ("PENDING".equalsIgnoreCase(item.getStatus())) {
                item.setStatus("PREPARING");
            }
        });

        order.setStatus("SENT");
        Order savedOrder = orderRepository.save(order);

        // Push WebSocket update to Kitchen Display System (KDS)
        createdTickets.forEach(ticket -> 
            messagingTemplate.convertAndSend("/topic/kitchen/tickets", ticket)
        );

        // Push WebSocket update to POS Waiter screens
        messagingTemplate.convertAndSend("/topic/orders/" + orderId, savedOrder);

        return savedOrder;
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = getOrderById(orderId);
        order.setStatus(status.toUpperCase());
        Order savedOrder = orderRepository.save(order);

        // Push WebSocket update
        messagingTemplate.convertAndSend("/topic/orders/" + orderId, savedOrder);
        
        return savedOrder;
    }
}
