package com.restaurant.pos_backend.controller;

import com.restaurant.pos_backend.dto.MenuCategoryRequest;
import com.restaurant.pos_backend.dto.MenuItemRequest;
import com.restaurant.pos_backend.entity.MenuCategory;
import com.restaurant.pos_backend.entity.MenuItem;
import com.restaurant.pos_backend.service.MenuService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "*")
public class MenuController {

    @Autowired
    private MenuService menuService;

    // --- CATEGORY ENDPOINTS ---

    @GetMapping("/categories")
    public ResponseEntity<List<MenuCategory>> getCategories(@RequestParam(defaultValue = "1") Long branchId) {
        List<MenuCategory> categories = menuService.getCategoriesByBranch(branchId);
        return ResponseEntity.ok(categories);
    }

    @PostMapping("/categories")
    @PreAuthorize("hasAuthority('menu:manage') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<MenuCategory> createCategory(@Valid @RequestBody MenuCategoryRequest request) {
        MenuCategory category = menuService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(category);
    }

    // --- MENU ITEM ENDPOINTS ---

    @GetMapping("/items")
    public ResponseEntity<List<MenuItem>> getMenuItems(
            @RequestParam(defaultValue = "1") Long branchId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Boolean availableOnly) {
        List<MenuItem> items = menuService.getMenuItems(branchId, categoryId, availableOnly);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/items/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable Long id) {
        MenuItem item = menuService.getMenuItemById(id);
        return ResponseEntity.ok(item);
    }

    @PostMapping("/items")
    @PreAuthorize("hasAuthority('menu:manage') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<MenuItem> createMenuItem(@Valid @RequestBody MenuItemRequest request) {
        MenuItem item = menuService.createMenuItem(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(item);
    }

    @PutMapping("/items/{id}")
    @PreAuthorize("hasAuthority('menu:manage') or hasRole('OWNER') or hasRole('MANAGER')")
    public ResponseEntity<MenuItem> updateMenuItem(@PathVariable Long id, @Valid @RequestBody MenuItemRequest request) {
        MenuItem item = menuService.updateMenuItem(id, request);
        return ResponseEntity.ok(item);
    }

    @PatchMapping("/items/{id}/availability")
    @PreAuthorize("hasAuthority('menu:manage') or hasRole('OWNER') or hasRole('MANAGER') or hasRole('KITCHEN')")
    public ResponseEntity<MenuItem> toggleAvailability(
            @PathVariable Long id,
            @RequestParam Boolean isAvailable) {
        MenuItem item = menuService.toggleAvailability(id, isAvailable);
        return ResponseEntity.ok(item);
    }
}
