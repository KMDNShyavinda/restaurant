package com.restaurant.pos_backend.controller;

import com.restaurant.pos_backend.dto.TableRequest;
import com.restaurant.pos_backend.entity.TableEntity;
import com.restaurant.pos_backend.service.TableService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = "*")
public class TableController {

    @Autowired
    private TableService tableService;

    @GetMapping
    public ResponseEntity<List<TableEntity>> getTables(
            @RequestParam(defaultValue = "1") Long branchId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String zone) {
        List<TableEntity> tables = tableService.getTables(branchId, status, zone);
        return ResponseEntity.ok(tables);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TableEntity> getTableById(@PathVariable Long id) {
        TableEntity table = tableService.getTableById(id);
        return ResponseEntity.ok(table);
    }

    @PostMapping
    @PreAuthorize("hasRole('OWNER') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<TableEntity> createTable(@Valid @RequestBody TableRequest request) {
        TableEntity table = tableService.createTable(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(table);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('orders:create') or hasRole('WAITER') or hasRole('CASHIER') or hasRole('MANAGER') or hasRole('OWNER') or hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<TableEntity> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        TableEntity table = tableService.updateStatus(id, status);
        return ResponseEntity.ok(table);
    }

    @PatchMapping("/{id}/position")
    @PreAuthorize("hasRole('MANAGER') or hasRole('OWNER') or hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<TableEntity> updatePosition(
            @PathVariable Long id,
            @RequestParam Double x,
            @RequestParam Double y) {
        TableEntity table = tableService.updatePosition(id, x, y);
        return ResponseEntity.ok(table);
    }
}
