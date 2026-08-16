package com.restaurant.pos_backend.service;

import com.restaurant.pos_backend.entity.Order;
import com.restaurant.pos_backend.entity.OrderItem;
import com.restaurant.pos_backend.entity.Promotion;
import com.restaurant.pos_backend.repository.OrderRepository;
import com.restaurant.pos_backend.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Transactional
    public Order applyPromotionToOrder(Long orderId, String promoCode) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        Promotion promotion = promotionRepository.findByCode(promoCode.toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid promo code."));

        if (!promotion.getIsActive()) {
            throw new IllegalArgumentException("Promo code is inactive.");
        }
        
        LocalDateTime now = LocalDateTime.now();
        if (promotion.getStartDate() != null && now.isBefore(promotion.getStartDate())) {
            throw new IllegalArgumentException("Promo code is not yet active.");
        }
        if (promotion.getEndDate() != null && now.isAfter(promotion.getEndDate())) {
            throw new IllegalArgumentException("Promo code has expired.");
        }

        BigDecimal discountAmount = calculateDiscount(order, promotion);

        order.setPromotion(promotion);
        order.setDiscountAmount(discountAmount);

        return orderRepository.save(order);
    }
    
    @Transactional
    public Order removePromotionFromOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        order.setPromotion(null);
        order.setDiscountAmount(BigDecimal.ZERO);
        return orderRepository.save(order);
    }

    private BigDecimal calculateDiscount(Order order, Promotion promotion) {
        BigDecimal totalBeforeDiscount = order.getItems().stream()
                .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        switch (promotion.getType().toUpperCase()) {
            case "FLAT":
                return promotion.getValue().min(totalBeforeDiscount);
            case "PERCENTAGE":
                BigDecimal discount = totalBeforeDiscount
                        .multiply(promotion.getValue())
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                return discount.min(totalBeforeDiscount);
            case "BOGO":
                // Basic BOGO logic: If 2 or more items exist, cheapest one is free
                Optional<BigDecimal> cheapestItem = order.getItems().stream()
                        .filter(item -> item.getQuantity() > 0)
                        .map(OrderItem::getUnitPrice)
                        .min(BigDecimal::compareTo);

                if (cheapestItem.isPresent() && order.getItems().stream().mapToInt(OrderItem::getQuantity).sum() >= 2) {
                    return cheapestItem.get();
                }
                return BigDecimal.ZERO;
            default:
                return BigDecimal.ZERO;
        }
    }
}
