-- =========================================
-- V5__sync_sequences.sql
-- Synchronize PostgreSQL auto-increment sequences with max IDs
-- =========================================

SELECT setval('restaurants_id_seq', COALESCE((SELECT MAX(id) FROM restaurants), 1));
SELECT setval('branches_id_seq', COALESCE((SELECT MAX(id) FROM branches), 1));
SELECT setval('roles_id_seq', COALESCE((SELECT MAX(id) FROM roles), 1));
SELECT setval('permissions_id_seq', COALESCE((SELECT MAX(id) FROM permissions), 1));
SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1));
SELECT setval('shifts_id_seq', COALESCE((SELECT MAX(id) FROM shifts), 1));
SELECT setval('customers_id_seq', COALESCE((SELECT MAX(id) FROM customers), 1));
SELECT setval('tables_id_seq', COALESCE((SELECT MAX(id) FROM tables), 1));
SELECT setval('reservations_id_seq', COALESCE((SELECT MAX(id) FROM reservations), 1));
SELECT setval('menu_categories_id_seq', COALESCE((SELECT MAX(id) FROM menu_categories), 1));
SELECT setval('menu_items_id_seq', COALESCE((SELECT MAX(id) FROM menu_items), 1));
SELECT setval('modifier_groups_id_seq', COALESCE((SELECT MAX(id) FROM modifier_groups), 1));
SELECT setval('modifiers_id_seq', COALESCE((SELECT MAX(id) FROM modifiers), 1));
SELECT setval('ingredients_id_seq', COALESCE((SELECT MAX(id) FROM ingredients), 1));
SELECT setval('recipe_items_id_seq', COALESCE((SELECT MAX(id) FROM recipe_items), 1));
SELECT setval('suppliers_id_seq', COALESCE((SELECT MAX(id) FROM suppliers), 1));
SELECT setval('purchase_orders_id_seq', COALESCE((SELECT MAX(id) FROM purchase_orders), 1));
SELECT setval('purchase_order_items_id_seq', COALESCE((SELECT MAX(id) FROM purchase_order_items), 1));
SELECT setval('stock_adjustments_id_seq', COALESCE((SELECT MAX(id) FROM stock_adjustments), 1));
SELECT setval('orders_id_seq', COALESCE((SELECT MAX(id) FROM orders), 1));
SELECT setval('order_items_id_seq', COALESCE((SELECT MAX(id) FROM order_items), 1));
SELECT setval('kitchen_tickets_id_seq', COALESCE((SELECT MAX(id) FROM kitchen_tickets), 1));
SELECT setval('taxes_id_seq', COALESCE((SELECT MAX(id) FROM taxes), 1));
SELECT setval('discounts_id_seq', COALESCE((SELECT MAX(id) FROM discounts), 1));
SELECT setval('payments_id_seq', COALESCE((SELECT MAX(id) FROM payments), 1));
SELECT setval('invoices_id_seq', COALESCE((SELECT MAX(id) FROM invoices), 1));
SELECT setval('audit_logs_id_seq', COALESCE((SELECT MAX(id) FROM audit_logs), 1));
