package com.restaurant.pos_backend.service;

import com.restaurant.pos_backend.dto.TableRequest;
import com.restaurant.pos_backend.entity.Branch;
import com.restaurant.pos_backend.entity.TableEntity;
import com.restaurant.pos_backend.repository.BranchRepository;
import com.restaurant.pos_backend.repository.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TableService {

    @Autowired
    private TableRepository tableRepository;

    @Autowired
    private BranchRepository branchRepository;

    public List<TableEntity> getTables(Long branchId, String status, String zone) {
        if (status != null) {
            return tableRepository.findByBranchIdAndStatus(branchId, status);
        }
        if (zone != null) {
            return tableRepository.findByBranchIdAndZone(branchId, zone);
        }
        return tableRepository.findByBranchId(branchId);
    }

    public TableEntity getTableById(Long id) {
        return tableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Table not found with ID: " + id));
    }

    @Transactional
    public TableEntity createTable(TableRequest request) {
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new RuntimeException("Branch not found with ID: " + request.getBranchId()));

        TableEntity table = TableEntity.builder()
                .branch(branch)
                .tableNumber(request.getTableNumber())
                .capacity(request.getCapacity())
                .zone(request.getZone() != null ? request.getZone() : "Main Dining")
                .status(request.getStatus() != null ? request.getStatus() : "FREE")
                .build();

        return tableRepository.save(table);
    }

    @Transactional
    public TableEntity updateStatus(Long id, String status) {
        TableEntity table = getTableById(id);
        table.setStatus(status.toUpperCase());
        return tableRepository.save(table);
    }
}
