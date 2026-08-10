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
import com.restaurant.pos_backend.repository.DishRatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;

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

    @Autowired
    private DishRatingRepository dishRatingRepository;

    // --- CATEGORY OPERATIONS ---

    @Cacheable(value = "menuCategories", key = "#branchId")
    public List<MenuCategory> getCategoriesByBranch(Long branchId) {
        return categoryRepository.findByBranchIdOrderBySortOrderAsc(branchId);
    }

    @Transactional
    @CacheEvict(value = {"menuCategories", "menuItems"}, allEntries = true)
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

    @Cacheable(value = "menuItems", key = "#branchId + '-' + #categoryId + '-' + #availableOnly")
    public List<MenuItem> getMenuItems(Long branchId, Long categoryId, Boolean availableOnly) {
        List<MenuItem> items;
        if (categoryId != null) {
            items = menuItemRepository.findByCategoryId(categoryId);
        } else if (Boolean.TRUE.equals(availableOnly)) {
            items = menuItemRepository.findByCategoryBranchIdAndIsAvailable(branchId, true);
        } else {
            items = menuItemRepository.findByCategoryBranchId(branchId);
        }
        
        // Populate ratings
        for (MenuItem item : items) {
            populateRatings(item);
        }
        
        return items;
    }

    private void populateRatings(MenuItem item) {
        Double avgRating = dishRatingRepository.getAverageRatingForMenuItem(item.getId());
        Long ratingCount = dishRatingRepository.getRatingCountForMenuItem(item.getId());
        item.setAverageRating(avgRating != null ? avgRating : 0.0);
        item.setRatingCount(ratingCount != null ? ratingCount : 0L);
    }

    public MenuItem getMenuItemById(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu Item not found with ID: " + id));
        populateRatings(item);
        return item;
    }

    @Transactional
    @CacheEvict(value = "menuItems", allEntries = true)
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
    @CacheEvict(value = "menuItems", allEntries = true)
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
    @CacheEvict(value = "menuItems", allEntries = true)
    public MenuItem toggleAvailability(Long id, Boolean isAvailable) {
        MenuItem menuItem = getMenuItemById(id);
        menuItem.setIsAvailable(isAvailable);
        return menuItemRepository.save(menuItem);
    }
}
