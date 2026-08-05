package com.restaurant.pos_backend.service;

import com.restaurant.pos_backend.dto.DishRatingRequest;
import com.restaurant.pos_backend.dto.FeedbackRequest;
import com.restaurant.pos_backend.entity.Customer;
import com.restaurant.pos_backend.entity.DishRating;
import com.restaurant.pos_backend.entity.Feedback;
import com.restaurant.pos_backend.entity.MenuItem;
import com.restaurant.pos_backend.repository.CustomerRepository;
import com.restaurant.pos_backend.repository.DishRatingRepository;
import com.restaurant.pos_backend.repository.FeedbackRepository;
import com.restaurant.pos_backend.repository.MenuItemRepository;
import com.restaurant.pos_backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private DishRatingRepository dishRatingRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    public List<Feedback> getRecentTopFeedbacks(int count) {
        return feedbackRepository.findTop5StarFeedbacks(PageRequest.of(0, count));
    }

    @Transactional
    public Feedback addFeedback(String email, FeedbackRequest request) {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Rule: Only allow feedback if they have at least 1 completed order
        long completedOrders = orderRepository.findByCustomer(customer).stream()
                .filter(o -> "COMPLETED".equals(o.getStatus()) || "PAID".equals(o.getStatus()) || "SERVED".equals(o.getStatus()))
                .count();
                
        if (completedOrders == 0) {
            throw new RuntimeException("You must complete at least one order to leave feedback.");
        }

        Feedback feedback = Feedback.builder()
                .customer(customer)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        return feedbackRepository.save(feedback);
    }

    @Transactional
    public DishRating addDishRating(String email, DishRatingRequest request) {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        MenuItem menuItem = menuItemRepository.findById(request.getMenuItemId())
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        DishRating dishRating = DishRating.builder()
                .customer(customer)
                .menuItem(menuItem)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        return dishRatingRepository.save(dishRating);
    }
}
