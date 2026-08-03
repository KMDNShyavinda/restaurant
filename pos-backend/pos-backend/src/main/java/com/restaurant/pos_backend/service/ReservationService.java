package com.restaurant.pos_backend.service;

import com.restaurant.pos_backend.dto.ReservationRequest;
import com.restaurant.pos_backend.entity.Customer;
import com.restaurant.pos_backend.entity.Reservation;
import com.restaurant.pos_backend.entity.TableEntity;
import com.restaurant.pos_backend.repository.CustomerRepository;
import com.restaurant.pos_backend.repository.ReservationRepository;
import com.restaurant.pos_backend.repository.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private TableRepository tableRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public List<Reservation> getReservations(Long branchId, LocalDate date) {
        if (date != null) {
            LocalDateTime start = date.atStartOfDay();
            LocalDateTime end = date.atTime(LocalTime.MAX);
            return reservationRepository.findByTableBranchIdAndReservationTimeBetween(branchId, start, end);
        }
        return reservationRepository.findByTableBranchId(branchId);
    }

    @Transactional
    public Reservation createReservation(ReservationRequest request) {
        TableEntity table = tableRepository.findById(request.getTableId())
                .orElseThrow(() -> new RuntimeException("Table not found with ID: " + request.getTableId()));

        // Find or create customer
        Customer customer = customerRepository.findByPhone(request.getCustomerPhone())
                .orElseGet(() -> customerRepository.save(Customer.builder()
                        .name(request.getCustomerName())
                        .phone(request.getCustomerPhone())
                        .email(request.getCustomerEmail())
                        .build()));

        Reservation reservation = Reservation.builder()
                .table(table)
                .customer(customer)
                .reservationTime(request.getReservationTime())
                .partySize(request.getPartySize())
                .status("CONFIRMED")
                .build();

        // Update table status to RESERVED if reservation is for today
        if (request.getReservationTime().toLocalDate().equals(LocalDate.now())) {
            table.setStatus("RESERVED");
            tableRepository.save(table);
        }

        return reservationRepository.save(reservation);
    }

    @Transactional
    public Reservation updateStatus(Long id, String status) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with ID: " + id));

        reservation.setStatus(status.toUpperCase());

        if ("CANCELLED".equalsIgnoreCase(status) || "COMPLETED".equalsIgnoreCase(status)) {
            TableEntity table = reservation.getTable();
            if ("RESERVED".equalsIgnoreCase(table.getStatus())) {
                table.setStatus("FREE");
                tableRepository.save(table);
            }
        }

        return reservationRepository.save(reservation);
    }
}
