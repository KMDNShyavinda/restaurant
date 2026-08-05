package com.restaurant.pos_backend.controller;

import com.restaurant.pos_backend.dto.DishRatingRequest;
import com.restaurant.pos_backend.dto.FeedbackRequest;
import com.restaurant.pos_backend.entity.DishRating;
import com.restaurant.pos_backend.entity.Feedback;
import com.restaurant.pos_backend.security.CustomUserDetails;
import com.restaurant.pos_backend.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
@CrossOrigin(origins = "*")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    // Public endpoint to get recent top feedbacks for the homepage
    @GetMapping
    public ResponseEntity<List<Feedback>> getRecentFeedbacks(@RequestParam(defaultValue = "6") int count) {
        return ResponseEntity.ok(feedbackService.getRecentTopFeedbacks(count));
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Feedback> addFeedback(
            @Valid @RequestBody FeedbackRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Feedback feedback = feedbackService.addFeedback(userDetails.getUsername(), request);
        return ResponseEntity.ok(feedback);
    }
}
