-- ------------------------------------------------------------------------------
-- Flyway Database Migration V9: Performance B-Tree Indexes
-- ------------------------------------------------------------------------------

-- Speed up POS and KDS dashboard status filtering
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON orders (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_table_id ON orders (table_id);

-- Speed up order item retrieval
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);

-- Speed up KDS active ticket lookups
CREATE INDEX IF NOT EXISTS idx_kitchen_tickets_status_printed ON kitchen_tickets (status, printed_at DESC);

-- Speed up invoice and payment lookups
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments (order_id);
