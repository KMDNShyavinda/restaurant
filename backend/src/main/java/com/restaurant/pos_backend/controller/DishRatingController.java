package com.restaurant.pos_backend.controller;

import com.restaurant.pos_backend.dto.DishRatingRequest;
import com.restaurant.pos_backend.entity.DishRating;
import com.restaurant.pos_backend.security.CustomUserDetails;
import com.restaurant.pos_backend.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dish-ratings")
@CrossOrigin(origins = "*")
public class DishRatingController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<DishRating> addDishRating(
            @Valid @RequestBody DishRatingRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        DishRating dishRating = feedbackService.addDishRating(userDetails.getUsername(), request);
        return ResponseEntity.ok(dishRating);
    }
}
