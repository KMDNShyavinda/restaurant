# 🍽️ The Royal Spice — Restaurant POS & Management System

A full-stack, enterprise-grade **Restaurant Point of Sale (POS) and Management System** for **The Royal Spice** built with modern web technologies. This application provides complete restaurant operation workflows including role-based authentication, an interactive floor plan & table management, a fast POS order terminal, real-time Kitchen Display System (KDS) via WebSockets, a Customer QR Self-Ordering Portal, and real-time inventory/stock tracking.

---

## 🏗️ Project Architecture & Tech Stack

The project is structured into two main decoupled modules: `frontend` and `backend`.

```
restaurant-pos/
├── backend/            # Spring Boot REST API & WebSocket Server
├── frontend/           # React + Vite Single Page Application (SPA)
└── docker-compose.yml  # Local database (PostgreSQL 15 & pgAdmin 4)
```

### **Backend (`/backend`)**
- **Language & Framework**: Java 21, Spring Boot 3.2.5
- **Security**: Spring Security with JWT (JSON Web Tokens) & Stateless Authentication
- **Database & ORM**: PostgreSQL 15, Spring Data JPA, Hibernate
- **Migrations**: Flyway Schema Migration (`V1__init_schema.sql`)
- **Real-Time Communication**: Spring WebSocket with STOMP protocol (for KDS order notifications)
- **API Documentation**: OpenAPI 3.0 / Springdoc Swagger UI
- **Build Tool**: Maven

### **Frontend (`/frontend`)**
- **Framework**: React 19, Vite
- **Styling**: Tailwind CSS v4, Lucide React Icons
- **Routing**: React Router v7
- **HTTP & Real-Time Client**: Axios, `@stomp/stompjs` & `sockjs-client`
- **Linting**: Oxlint

---

## 🔑 Demo Accounts & Pre-Seeded Sample Data

The application comes pre-loaded with rich sample data across all modules (Menu, Tables, Orders, KDS, Customers, Inventory):

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **System Owner / Admin** | `admin@pos.com` | `password123` | Full access to all modules & settings |
| **Branch Manager** | `manager@pos.com` | `password123` | Dashboard, Reports, Inventory & Menu |
| **Billing Cashier** | `cashier@pos.com` | `password123` | POS Terminal, Orders & Payments |
| **Waitstaff** | `waiter@pos.com` | `password123` | Table Layout, Reservations & Order Taking |
| **Kitchen Staff** | `kitchen@pos.com` | `password123` | Kitchen Display System (KDS) |

### 📦 Sample Dataset Highlights
- **14 Menu Items** across 5 Categories (Starters, Mains, Wood-Fired Pizza, Desserts, Beverages) with custom modifiers & image URLs.
- **8 Dining Tables** across 3 Zones (Main Floor, Patio, VIP Section) with pre-set statuses (`FREE`, `OCCUPIED`, `RESERVED`, `MAINTENANCE`).
- **Customer Database** with loyalty points and active reservations.
- **Real-Time KDS Tickets** in `QUEUED` & `IN_PREPARATION` states.
- **Inventory Stock Tracker** with 8 raw ingredients, recipe mappings, low-stock warnings (e.g. Mozzarella, Espresso Beans), and audit adjustment logs.

---

## 🌟 Core Features & Modules

### 1. 🔐 Security & Role-Based Access Control (RBAC)
- **Multi-Role Support**: Pre-configured roles including `ADMIN`, `MANAGER`, `CASHIER`, `KITCHEN_STAFF`, and `WAITER`.
- **JWT Token Authentication**: Secure endpoints with bearer tokens and automatic authorization guards on frontend routes (`/routes/ProtectedRoute.jsx`).

### 2. 📊 Management Dashboard (`/dashboard`)
- **Real-Time Analytics**: Visual overview of today's total revenue, active orders count, table utilization percentage, and critical low stock alerts.
- **Quick Navigation**: Instant shortcuts to POS Terminal, Floor Plan, KDS, and Inventory modules.

### 3. 🪑 Floor Plan & Table Management (`/tables`)
- **Interactive Floor Plan**: Dynamic visual layout of dining tables categorized by zones (Main Floor, Patio, VIP Section).
- **Status Indicators**: Color-coded states (`Available`, `Occupied`, `Reserved`, `Maintenance`).
- **Reservation System**: Book tables with customer details, reservation date/time, and guest counts.

### 4. 🛒 POS Order Terminal (`/pos`)
- **Dynamic Menu Catalog**: Searchable and categorized menu items with custom modifiers (e.g., Spice Level, Extra Toppings).
- **Cart Management**: Add/remove items, adjust quantities, choose order type (`Dine-In`, `Takeaway`, `Delivery`), and attach table numbers.
- **Billing & Payments**: Process single or split payments (Cash, Card, Digital Wallet) and generate invoices.

### 5. 👨‍🍳 Kitchen Display System (KDS) (`/kds`)
- **Live Ticket Dispatch**: Real-time order push to kitchen screens using WebSocket STOMP protocol.
- **Status Pipeline**: Interactive ticket progression through status stages: `PENDING` ➔ `IN_PREPARATION` ➔ `READY` ➔ `SERVED`.
- **Preparation Timers**: Live elapsed time indicators to highlight order urgency and prevent delay.

### 6. 📦 Inventory & Stock Control (`/inventory`)
- **Stock Tracking**: Monitor raw ingredients and menu item inventory levels in real-time.
- **Low Stock Thresholds**: Automated status flags (`IN_STOCK`, `LOW_STOCK`, `OUT_OF_STOCK`).
- **Stock Adjustments**: Audit log for restocking, wastage recording, and inventory reconciliation adjustments (`RESTOCK`, `WASTAGE`, `CORRECTION`).

---

## 🔌 API Endpoint Summary

The backend exposes RESTful APIs under the `/api` base path:

| Domain | Base Path | Description |
| :--- | :--- | :--- |
| **Auth** | `/api/auth` | Login (`/login`) and current user info (`/me`) |
| **Tables** | `/api/tables` | Table layout, status updates, and floor plans |
| **Reservations** | `/api/reservations` | Customer table booking management |
| **Menu** | `/api/menu` | Menu categories, items, and modifier groups |
| **Orders** | `/api/orders` | Order creation, item management, and status tracking |
| **Payments** | `/api/payments` | Payment processing and invoice generation |
| **Kitchen** | `/api/kitchen` | KDS tickets status pipeline and WebSocket topic |
| **Inventory** | `/api/inventory` | Ingredients, stock levels, and adjustment logs |

> 💡 **Swagger API Documentation**: Available at `http://localhost:8080/swagger-ui.html` when backend is running.

---

## 🚀 Getting Started & Local Setup

### **Prerequisites**
- **Java 21 JDK**
- **Node.js** (v18 or higher) & **npm**
- **Docker Desktop** (for containerized PostgreSQL & pgAdmin)

---

### **Step 1: Start Database Services**

Launch PostgreSQL and pgAdmin using Docker Compose from the root directory:

```bash
docker-compose up -d
```

- **PostgreSQL**: `localhost:5432` (Database: `pos_db`, User: `pos_user`, Password: `pos_password`)
- **pgAdmin 4**: `http://localhost:5050` (Email: `admin@pos.com`, Password: `adminpassword`)

---

### **Step 2: Start Backend Application**

Navigate to the `backend` folder and run Spring Boot:

```bash
cd backend
./mvnw spring-boot:run
```

*(On Windows PowerShell, use `.\mvnw.cmd spring-boot:run`)*

The Spring Boot backend will start on **`http://localhost:8080`**. Flyway will automatically execute schema migrations (`V1__init_schema.sql`).

---

### **Step 3: Start Frontend Application**

Navigate to the `frontend` folder, install dependencies, and start Vite dev server:

```bash
cd frontend
npm install
npm run dev
```

The React frontend will start on **`http://localhost:5173`**.

---

## 📝 License & Contributions

This project is created for restaurant operations and point-of-sale management. Feel free to modify and expand its features!
