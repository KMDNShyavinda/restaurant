-- =========================================
-- 1. IDENTITY, ACCESS & BRANCH STRUCTURE
-- =========================================
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    module VARCHAR(50) NOT NULL
);

CREATE TABLE role_permissions (
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INT REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    timezone VARCHAR(50) DEFAULT 'UTC'
);

CREATE TABLE branches (
    id SERIAL PRIMARY KEY,
    restaurant_id INT REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    branch_id INT REFERENCES branches(id),
    role_id INT REFERENCES roles(id),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shifts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    branch_id INT REFERENCES branches(id),
    opening_cash NUMERIC(10,2),
    closing_cash NUMERIC(10,2),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    status VARCHAR(20) DEFAULT 'OPEN'
);

-- =========================================
-- 2. CUSTOMERS & RESTAURANT STRUCTURE
-- =========================================
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(150),
    address VARCHAR(255),
    loyalty_points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tables (
    id SERIAL PRIMARY KEY,
    branch_id INT REFERENCES branches(id),
    table_number VARCHAR(10) NOT NULL,
    capacity INT,
    zone VARCHAR(50),
    status VARCHAR(20) DEFAULT 'FREE'
);

CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    table_id INT REFERENCES tables(id),
    customer_id INT REFERENCES customers(id),
    reservation_time TIMESTAMP NOT NULL,
    party_size INT,
    status VARCHAR(20) DEFAULT 'PENDING'
);

-- =========================================
-- 3. MENU MANAGEMENT
-- =========================================
CREATE TABLE menu_categories (
    id SERIAL PRIMARY KEY,
    branch_id INT REFERENCES branches(id),
    name VARCHAR(100) NOT NULL,
    sort_order INT DEFAULT 0
);

CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES menu_categories(id),
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    prep_time_min INT,
    station VARCHAR(30) DEFAULT 'KITCHEN'
);

CREATE TABLE modifier_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    min_select INT DEFAULT 0,
    max_select INT DEFAULT 1
);

CREATE TABLE modifiers (
    id SERIAL PRIMARY KEY,
    modifier_group_id INT REFERENCES modifier_groups(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    extra_price NUMERIC(10,2) DEFAULT 0
);

CREATE TABLE menu_item_modifier_groups (
    menu_item_id INT REFERENCES menu_items(id) ON DELETE CASCADE,
    modifier_group_id INT REFERENCES modifier_groups(id) ON DELETE CASCADE,
    PRIMARY KEY (menu_item_id, modifier_group_id)
);

-- =========================================
-- 4. INVENTORY & RECIPES
-- =========================================
CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    branch_id INT REFERENCES branches(id),
    name VARCHAR(100) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    current_stock NUMERIC(10,2) DEFAULT 0,
    reorder_level NUMERIC(10,2) DEFAULT 0
);

CREATE TABLE recipe_items (
    id SERIAL PRIMARY KEY,
    menu_item_id INT REFERENCES menu_items(id) ON DELETE CASCADE,
    ingredient_id INT REFERENCES ingredients(id),
    quantity_used NUMERIC(10,3) NOT NULL
);

CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    contact_info VARCHAR(255)
);

CREATE TABLE purchase_orders (
    id SERIAL PRIMARY KEY,
    supplier_id INT REFERENCES suppliers(id),
    branch_id INT REFERENCES branches(id),
    status VARCHAR(20) DEFAULT 'PENDING',
    ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE purchase_order_items (
    id SERIAL PRIMARY KEY,
    purchase_order_id INT REFERENCES purchase_orders(id) ON DELETE CASCADE,
    ingredient_id INT REFERENCES ingredients(id),
    quantity NUMERIC(10,2) NOT NULL,
    unit_cost NUMERIC(10,2) NOT NULL
);

CREATE TABLE stock_adjustments (
    id SERIAL PRIMARY KEY,
    ingredient_id INT REFERENCES ingredients(id),
    branch_id INT REFERENCES branches(id),
    type VARCHAR(20) NOT NULL,
    quantity NUMERIC(10,2) NOT NULL,
    reason VARCHAR(255),
    recorded_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- 5. ORDERS, BILLING & PAYMENTS
-- =========================================
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    branch_id INT REFERENCES branches(id),
    table_id INT REFERENCES tables(id),
    customer_id INT REFERENCES customers(id),
    waiter_id INT REFERENCES users(id),
    order_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INT REFERENCES menu_items(id),
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10,2) NOT NULL,
    notes VARCHAR(255),
    status VARCHAR(20) DEFAULT 'PENDING'
);

CREATE TABLE order_item_modifiers (
    order_item_id INT REFERENCES order_items(id) ON DELETE CASCADE,
    modifier_id INT REFERENCES modifiers(id),
    PRIMARY KEY (order_item_id, modifier_id)
);

CREATE TABLE kitchen_tickets (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    station VARCHAR(30),
    printed_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'QUEUED'
);

CREATE TABLE taxes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    rate NUMERIC(5,2) NOT NULL,
    applies_to VARCHAR(20) DEFAULT 'ORDER'
);

CREATE TABLE discounts (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    type VARCHAR(20),
    value NUMERIC(10,2),
    valid_from DATE,
    valid_to DATE
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    method VARCHAR(20) NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'COMPLETED',
    transaction_ref VARCHAR(100),
    processed_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    invoice_number VARCHAR(50) UNIQUE,
    total NUMERIC(10,2),
    tax_total NUMERIC(10,2),
    discount_total NUMERIC(10,2),
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    action VARCHAR(100),
    entity_affected VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- INITIAL SEED DATA (Default Admin & Roles)
-- =========================================
INSERT INTO restaurants (id, name, currency, timezone) VALUES (1, 'Gourmet Bistro', 'USD', 'UTC');
INSERT INTO branches (id, restaurant_id, name, address, phone) VALUES (1, 1, 'Main Branch', '123 Main St', '555-0199');

INSERT INTO roles (id, name, description) VALUES
(1, 'OWNER', 'Full System Admin'),
(2, 'MANAGER', 'Branch Manager'),
(3, 'CASHIER', 'Billing & Cashier'),
(4, 'WAITER', 'Waitstaff Table Order Taking'),
(5, 'KITCHEN', 'Kitchen Display Staff');

INSERT INTO permissions (id, code, module) VALUES
(1, 'orders:create', 'ORDERS'),
(2, 'orders:read', 'ORDERS'),
(3, 'orders:update', 'ORDERS'),
(4, 'kitchen:manage', 'KITCHEN'),
(5, 'payments:process', 'PAYMENTS'),
(6, 'reports:view', 'REPORTS'),
(7, 'menu:manage', 'MENU'),
(8, 'inventory:manage', 'INVENTORY');

INSERT INTO role_permissions (role_id, permission_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8),
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8),
(3, 1), (3, 2), (3, 5),
(4, 1), (4, 2), (4, 3),
(5, 4);

-- Default Password: "password123" (BCrypt hashed)
INSERT INTO users (id, branch_id, role_id, name, email, password_hash) VALUES
(1, 1, 1, 'System Owner', 'admin@pos.com', '$2a$10$e8w.KzR1aI0X5/kZ1N.2n.VwHqD43fTj9k5x1pYg6.gQ/H6W/n4eS');
