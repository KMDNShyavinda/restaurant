package com.restaurant.pos_backend.repository;

import com.restaurant.pos_backend.entity.Feedback;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    
    // Find the latest 5-star feedbacks
    @Query("SELECT f FROM Feedback f WHERE f.rating = 5 ORDER BY f.createdAt DESC")
    List<Feedback> findTop5StarFeedbacks(Pageable pageable);
}
