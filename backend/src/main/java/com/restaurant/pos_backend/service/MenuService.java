package com.restaurant.pos_backend.service;

import com.restaurant.pos_backend.dto.MenuCategoryRequest;
import com.restaurant.pos_backend.dto.MenuItemRequest;
import com.restaurant.pos_backend.entity.Branch;
import com.restaurant.pos_backend.entity.MenuCategory;
import com.restaurant.pos_backend.entity.MenuItem;
import com.restaurant.pos_backend.entity.ModifierGroup;
import com.restaurant.pos_backend.repository.BranchRepository;
import com.restaurant.pos_backend.repository.MenuCategoryRepository;
import com.restaurant.pos_backend.repository.MenuItemRepository;
import com.restaurant.pos_backend.repository.ModifierGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class MenuService {

    @Autowired
    private MenuCategoryRepository categoryRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private ModifierGroupRepository modifierGroupRepository;

    // --- CATEGORY OPERATIONS ---

    public List<MenuCategory> getCategoriesByBranch(Long branchId) {
        return categoryRepository.findByBranchIdOrderBySortOrderAsc(branchId);
    }

    @Transactional
    public MenuCategory createCategory(MenuCategoryRequest request) {
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new RuntimeException("Branch not found with ID: " + request.getBranchId()));

        MenuCategory category = MenuCategory.builder()
                .branch(branch)
                .name(request.getName())
                .sortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0)
                .build();

        return categoryRepository.save(category);
    }

    // --- MENU ITEM OPERATIONS ---

    public List<MenuItem> getMenuItems(Long branchId, Long categoryId, Boolean availableOnly) {
        if (categoryId != null) {
            return menuItemRepository.findByCategoryId(categoryId);
        }
        if (Boolean.TRUE.equals(availableOnly)) {
            return menuItemRepository.findByCategoryBranchIdAndIsAvailable(branchId, true);
        }
        return menuItemRepository.findByCategoryBranchId(branchId);
    }

    public MenuItem getMenuItemById(Long id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu Item not found with ID: " + id));
    }

    @Transactional
    public MenuItem createMenuItem(MenuItemRequest request) {
        MenuCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + request.getCategoryId()));

        Set<ModifierGroup> modifierGroups = new HashSet<>();
        if (request.getModifierGroupIds() != null && !request.getModifierGroupIds().isEmpty()) {
            modifierGroups.addAll(modifierGroupRepository.findAllById(request.getModifierGroupIds()));
        }

        MenuItem menuItem = MenuItem.builder()
                .category(category)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .isAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true)
                .prepTimeMin(request.getPrepTimeMin())
                .station(request.getStation() != null ? request.getStation() : "KITCHEN")
                .modifierGroups(modifierGroups)
                .build();

        return menuItemRepository.save(menuItem);
    }

    @Transactional
    public MenuItem updateMenuItem(Long id, MenuItemRequest request) {
        MenuItem menuItem = getMenuItemById(id);

        if (!menuItem.getCategory().getId().equals(request.getCategoryId())) {
            MenuCategory category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with ID: " + request.getCategoryId()));
            menuItem.setCategory(category);
        }

        menuItem.setName(request.getName());
        menuItem.setDescription(request.getDescription());
        menuItem.setPrice(request.getPrice());
        menuItem.setImageUrl(request.getImageUrl());
        menuItem.setPrepTimeMin(request.getPrepTimeMin());
        if (request.getIsAvailable() != null) menuItem.setIsAvailable(request.getIsAvailable());
        if (request.getStation() != null) menuItem.setStation(request.getStation());

        if (request.getModifierGroupIds() != null) {
            Set<ModifierGroup> modifierGroups = new HashSet<>(modifierGroupRepository.findAllById(request.getModifierGroupIds()));
            menuItem.setModifierGroups(modifierGroups);
        }

        return menuItemRepository.save(menuItem);
    }

    @Transactional
    public MenuItem toggleAvailability(Long id, Boolean isAvailable) {
        MenuItem menuItem = getMenuItemById(id);
        menuItem.setIsAvailable(isAvailable);
        return menuItemRepository.save(menuItem);
    }
}
