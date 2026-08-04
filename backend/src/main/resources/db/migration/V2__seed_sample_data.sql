-- =========================================
-- V2__seed_sample_data.sql
-- Sample Seed Data for Restaurant POS System
-- =========================================

-- 1. ADDITIONAL USERS FOR TESTING ALL ROLES
-- (Passwords default hash for 'password123', also updated by DataInitializer)
INSERT INTO users (branch_id, role_id, name, email, phone, password_hash) VALUES
(1, 2, 'Sarah Manager', 'manager@pos.com', '555-0102', '$2a$10$e8w.KzR1aI0X5/kZ1N.2n.VwHqD43fTj9k5x1pYg6.gQ/H6W/n4eS'),
(1, 3, 'Chris Cashier', 'cashier@pos.com', '555-0103', '$2a$10$e8w.KzR1aI0X5/kZ1N.2n.VwHqD43fTj9k5x1pYg6.gQ/H6W/n4eS'),
(1, 4, 'Will Waiter', 'waiter@pos.com', '555-0104', '$2a$10$e8w.KzR1aI0X5/kZ1N.2n.VwHqD43fTj9k5x1pYg6.gQ/H6W/n4eS'),
(1, 5, 'Kevin Kitchen', 'kitchen@pos.com', '555-0105', '$2a$10$e8w.KzR1aI0X5/kZ1N.2n.VwHqD43fTj9k5x1pYg6.gQ/H6W/n4eS')
ON CONFLICT (email) DO NOTHING;

-- 2. CUSTOMERS
INSERT INTO customers (id, name, phone, email, address, loyalty_points) VALUES
(1, 'John Doe', '555-1111', 'john.doe@example.com', '12 Park Ave, New York', 120),
(2, 'Jane Smith', '555-2222', 'jane.smith@example.com', '45 Broadway, New York', 350),
(3, 'Robert Johnson', '555-3333', 'robert.j@example.com', '88 5th Ave, New York', 50),
(4, 'Emily Davis', '555-4444', 'emily.davis@example.com', '101 Wall St, New York', 210)
ON CONFLICT (id) DO NOTHING;

-- 3. TABLES (FLOOR PLAN)
INSERT INTO tables (id, branch_id, table_number, capacity, zone, status) VALUES
(1, 1, 'T-01', 4, 'Main Floor', 'FREE'),
(2, 1, 'T-02', 2, 'Main Floor', 'OCCUPIED'),
(3, 1, 'T-03', 6, 'Main Floor', 'FREE'),
(4, 1, 'T-04', 4, 'Main Floor', 'RESERVED'),
(5, 1, 'T-05', 2, 'Patio', 'FREE'),
(6, 1, 'T-06', 4, 'Patio', 'OCCUPIED'),
(7, 1, 'VIP-1', 8, 'VIP Section', 'FREE'),
(8, 1, 'VIP-2', 8, 'VIP Section', 'MAINTENANCE')
ON CONFLICT (id) DO NOTHING;

-- 4. RESERVATIONS
INSERT INTO reservations (id, table_id, customer_id, reservation_time, party_size, status) VALUES
(1, 4, 1, CURRENT_TIMESTAMP + INTERVAL '2 hours', 4, 'CONFIRMED'),
(2, 7, 2, CURRENT_TIMESTAMP + INTERVAL '1 day', 6, 'PENDING')
ON CONFLICT (id) DO NOTHING;

-- 5. MENU CATEGORIES
INSERT INTO menu_categories (id, branch_id, name, sort_order) VALUES
(1, 1, 'Starters & Appetizers', 1),
(2, 1, 'Main Courses', 2),
(3, 1, 'Wood-Fired Pizza', 3),
(4, 1, 'Desserts', 4),
(5, 1, 'Beverages', 5)
ON CONFLICT (id) DO NOTHING;

-- 6. MENU ITEMS
INSERT INTO menu_items (id, category_id, name, description, price, image_url, is_available, prep_time_min, station) VALUES
-- Starters
(1, 1, 'Crispy Calamari', 'Tender calamari lightly breaded and fried, served with spicy marinara sauce.', 12.99, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500', true, 10, 'KITCHEN'),
(2, 1, 'Truffle Parmesan Fries', 'Hand-cut fries tossed in white truffle oil, grated parmesan, and fresh parsley.', 8.50, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500', true, 8, 'KITCHEN'),
(3, 1, 'Classic Caesar Salad', 'Crisp romaine lettuce, garlic croutons, shaved parmesan, and homemade Caesar dressing.', 10.00, 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500', true, 7, 'COLD_PREP'),

-- Mains
(4, 2, 'Grilled Ribeye Steak', '12oz Prime Angus ribeye cooked to perfection, served with garlic herb butter and roasted asparagus.', 34.99, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500', true, 20, 'GRILL'),
(5, 2, 'Pan-Seared Atlantic Salmon', 'Fresh salmon fillet served over lemon risotto and asparagus with lemon butter sauce.', 26.50, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500', true, 18, 'GRILL'),
(6, 2, 'Fettuccine Chicken Alfredo', 'Creamy parmesan alfredo sauce tossed with grilled chicken breast and fresh fettuccine.', 18.99, 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500', true, 15, 'KITCHEN'),

-- Pizza
(7, 3, 'Margherita Pizza', 'San Marzano tomato sauce, fresh mozzarella, basil leaves, and extra virgin olive oil.', 14.99, 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500', true, 12, 'PIZZA_OVEN'),
(8, 3, 'Pepperoni Feast Pizza', 'Loaded with Italian pepperoni, spicy sausage, mozzarella, and house pizza sauce.', 17.50, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500', true, 12, 'PIZZA_OVEN'),
(9, 3, 'BBQ Chicken Pizza', 'Grilled chicken, smoky BBQ sauce, red onion, cilantro, and smoked gouda.', 18.50, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500', true, 14, 'PIZZA_OVEN'),

-- Desserts
(10, 4, 'Classic Tiramisu', 'Traditional Italian espresso-soaked ladyfingers with mascarpone cream and cocoa dusting.', 7.99, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500', true, 5, 'COLD_PREP'),
(11, 4, 'Chocolate Lava Cake', 'Warm chocolate molten cake served with a scoop of vanilla bean ice cream.', 8.99, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500', true, 10, 'KITCHEN'),

-- Beverages
(12, 5, 'Iced Passion Fruit Tea', 'Refreshing black tea infused with passion fruit and fresh mint.', 4.50, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500', true, 3, 'BAR'),
(13, 5, 'Double Espresso', 'Rich and intense double shot of house blend espresso.', 3.50, 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500', true, 3, 'BAR'),
(14, 5, 'Craft IPA Beer', 'Local brewery India Pale Ale with citrus and pine notes.', 7.00, 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500', true, 2, 'BAR')
ON CONFLICT (id) DO NOTHING;

-- 7. MODIFIER GROUPS & MODIFIERS
INSERT INTO modifier_groups (id, name, min_select, max_select) VALUES
(1, 'Steak Doneness', 1, 1),
(2, 'Pizza Crust', 0, 1),
(3, 'Drink Size', 0, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO modifiers (id, modifier_group_id, name, extra_price) VALUES
(1, 1, 'Rare', 0.00),
(2, 1, 'Medium Rare', 0.00),
(3, 1, 'Medium', 0.00),
(4, 1, 'Well Done', 0.00),

(5, 2, 'Original Thin Crust', 0.00),
(6, 2, 'Cheese Stuffed Crust', 2.50),
(7, 2, 'Gluten-Free Crust', 2.00),

(8, 3, 'Regular', 0.00),
(9, 3, 'Large (16 oz)', 1.25)
ON CONFLICT (id) DO NOTHING;

INSERT INTO menu_item_modifier_groups (menu_item_id, modifier_group_id) VALUES
(4, 1), -- Steak -> Steak Doneness
(7, 2), (8, 2), (9, 2), -- Pizzas -> Crust
(12, 3) -- Iced Tea -> Size
ON CONFLICT DO NOTHING;

-- 8. INGREDIENTS & STOCK
INSERT INTO ingredients (id, branch_id, name, unit, current_stock, reorder_level) VALUES
(1, 1, 'Angus Ribeye Cut', 'kg', 24.50, 5.00),
(2, 1, 'Atlantic Salmon Fillet', 'kg', 12.00, 3.00),
(3, 1, 'Pizza Dough Balls', 'pcs', 45.00, 10.00),
(4, 1, 'Shredded Mozzarella Cheese', 'kg', 3.20, 5.00), -- Low Stock
(5, 1, 'San Marzano Tomatoes', 'kg', 18.00, 4.00),
(6, 1, 'Espresso Coffee Beans', 'kg', 0.80, 2.00), -- Low Stock / Critical
(7, 1, 'Heavy Cream', 'L', 8.50, 2.50),
(8, 1, 'Fresh Calamari Rings', 'kg', 10.00, 3.00)
ON CONFLICT (id) DO NOTHING;

-- 9. RECIPE ITEMS
INSERT INTO recipe_items (id, menu_item_id, ingredient_id, quantity_used) VALUES
(1, 4, 1, 0.350), -- 350g Ribeye per Steak
(2, 5, 2, 0.250), -- 250g Salmon per Portion
(3, 7, 3, 1.000), -- 1 Dough ball per Margherita
(4, 7, 4, 0.150), -- 150g Mozzarella per Margherita
(5, 7, 5, 0.100), -- 100g Tomato Sauce per Margherita
(6, 13, 6, 0.018) -- 18g Espresso beans per double shot
ON CONFLICT (id) DO NOTHING;

-- 10. ACTIVE ORDERS & ORDER ITEMS
INSERT INTO orders (id, branch_id, table_id, customer_id, waiter_id, order_type, status, created_at) VALUES
(1, 1, 2, 1, 4, 'DINE_IN', 'OPEN', CURRENT_TIMESTAMP - INTERVAL '25 minutes'),
(2, 1, 6, 2, 4, 'DINE_IN', 'OPEN', CURRENT_TIMESTAMP - INTERVAL '10 minutes'),
(3, 1, NULL, 3, 3, 'TAKEAWAY', 'COMPLETED', CURRENT_TIMESTAMP - INTERVAL '1 hour')
ON CONFLICT (id) DO NOTHING;

INSERT INTO order_items (id, order_id, menu_item_id, quantity, unit_price, notes, status) VALUES
-- Order 1 items
(1, 1, 4, 1, 34.99, 'Medium Rare, extra asparagus', 'IN_PREPARATION'),
(2, 1, 1, 1, 12.99, 'Sauce on side', 'READY'),
(3, 1, 12, 2, 4.50, 'Less ice', 'SERVED'),

-- Order 2 items
(4, 2, 7, 1, 14.99, 'Extra crispy crust', 'PENDING'),
(5, 2, 2, 1, 8.50, NULL, 'PENDING'),

-- Order 3 items (Completed)
(6, 3, 8, 1, 17.50, NULL, 'SERVED'),
(7, 3, 13, 1, 3.50, NULL, 'SERVED')
ON CONFLICT (id) DO NOTHING;

-- 11. KITCHEN TICKETS
INSERT INTO kitchen_tickets (id, order_id, station, printed_at, status) VALUES
(1, 1, 'GRILL', CURRENT_TIMESTAMP - INTERVAL '24 minutes', 'IN_PREPARATION'),
(2, 2, 'PIZZA_OVEN', CURRENT_TIMESTAMP - INTERVAL '9 minutes', 'QUEUED')
ON CONFLICT (id) DO NOTHING;

-- 12. PAYMENTS & INVOICES (For Order 3)
INSERT INTO payments (id, order_id, method, amount, status, transaction_ref, processed_by, created_at) VALUES
(1, 3, 'CREDIT_CARD', 21.00, 'COMPLETED', 'TXN-99881122', 3, CURRENT_TIMESTAMP - INTERVAL '55 minutes')
ON CONFLICT (id) DO NOTHING;

INSERT INTO invoices (id, order_id, invoice_number, total, tax_total, discount_total, issued_at) VALUES
(1, 3, 'INV-2026-0001', 21.00, 1.75, 0.00, CURRENT_TIMESTAMP - INTERVAL '55 minutes')
ON CONFLICT (id) DO NOTHING;

-- 13. STOCK ADJUSTMENTS
INSERT INTO stock_adjustments (id, ingredient_id, branch_id, type, quantity, reason, recorded_by, created_at) VALUES
(1, 4, 1, 'RESTOCK', 10.00, 'Weekly supplier delivery from FreshDairy Co.', 2, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(2, 4, 1, 'WASTAGE', -2.50, 'Expired batch discarded during morning audit', 2, CURRENT_TIMESTAMP - INTERVAL '1 day'),
(3, 6, 1, 'CORRECTION', -0.50, 'Spill near espresso station', 2, CURRENT_TIMESTAMP - INTERVAL '5 hours')
ON CONFLICT (id) DO NOTHING;

-- Reset serial sequences for all tables so new insertions work seamlessly
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('customers_id_seq', (SELECT MAX(id) FROM customers));
SELECT setval('tables_id_seq', (SELECT MAX(id) FROM tables));
SELECT setval('reservations_id_seq', (SELECT MAX(id) FROM reservations));
SELECT setval('menu_categories_id_seq', (SELECT MAX(id) FROM menu_categories));
SELECT setval('menu_items_id_seq', (SELECT MAX(id) FROM menu_items));
SELECT setval('modifier_groups_id_seq', (SELECT MAX(id) FROM modifier_groups));
SELECT setval('modifiers_id_seq', (SELECT MAX(id) FROM modifiers));
SELECT setval('ingredients_id_seq', (SELECT MAX(id) FROM ingredients));
SELECT setval('recipe_items_id_seq', (SELECT MAX(id) FROM recipe_items));
SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders));
SELECT setval('order_items_id_seq', (SELECT MAX(id) FROM order_items));
SELECT setval('kitchen_tickets_id_seq', (SELECT MAX(id) FROM kitchen_tickets));
SELECT setval('payments_id_seq', (SELECT MAX(id) FROM payments));
SELECT setval('invoices_id_seq', (SELECT MAX(id) FROM invoices));
SELECT setval('stock_adjustments_id_seq', (SELECT MAX(id) FROM stock_adjustments));
