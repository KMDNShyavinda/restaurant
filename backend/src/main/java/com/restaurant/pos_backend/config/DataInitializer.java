package com.restaurant.pos_backend.config;

import com.restaurant.pos_backend.entity.*;
import com.restaurant.pos_backend.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MenuCategoryRepository menuCategoryRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private TableRepository tableRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        syncSequences();

        String encodedPassword = passwordEncoder.encode("password123");

        // Ensure CUSTOMER role exists (id 6)
        entityManager.createNativeQuery(
                "INSERT INTO roles (id, name, description) VALUES (6, 'CUSTOMER', 'Customer') ON CONFLICT (id) DO NOTHING"
        ).executeUpdate();

        // Guarantee all demo accounts exist with valid BCrypt hash
        createOrUpdateUser("admin@pos.com", "System Owner", 1L, encodedPassword);
        createOrUpdateUser("manager@pos.com", "Sarah Manager", 2L, encodedPassword);
        createOrUpdateUser("cashier@pos.com", "Chris Cashier", 3L, encodedPassword);
        createOrUpdateUser("waiter@pos.com", "Will Waiter", 4L, encodedPassword);
        createOrUpdateUser("kitchen@pos.com", "Kevin Kitchen", 5L, encodedPassword);
        createOrUpdateUser("customer@pos.com", "Charlie Customer", 6L, encodedPassword);

        System.out.println(">>> Demo account passwords initialized successfully for: admin, manager, cashier, waiter, kitchen, customer (password: password123)");

        // Seed sample data for all modules
        seedMenuData();
        seedTablesData();
        seedCustomersData();
        seedIngredientsData();
    }

    private void syncSequences() {
        String[] tables = {
            "restaurants", "branches", "roles", "permissions", "users", "shifts",
            "customers", "tables", "reservations", "menu_categories", "menu_items",
            "modifier_groups", "modifiers", "ingredients", "recipe_items", "suppliers",
            "purchase_orders", "purchase_order_items", "stock_adjustments", "orders",
            "order_items", "kitchen_tickets", "taxes", "discounts", "payments", "invoices", "audit_logs"
        };
        for (String table : tables) {
            try {
                String sql = String.format("SELECT setval('%s_id_seq', COALESCE((SELECT MAX(id) FROM %s), 1))", table, table);
                entityManager.createNativeQuery(sql).getSingleResult();
            } catch (Exception ignored) {
                // Ignore if table or sequence does not exist
            }
        }
    }

    private void createOrUpdateUser(String email, String defaultName, Long roleId, String encodedPassword) {
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(defaultName);
            return newUser;
        });

        user.setPasswordHash(encodedPassword);
        user.setStatus("ACTIVE");

        if (user.getRole() == null && roleId != null) {
            Role role = entityManager.find(Role.class, roleId);
            if (role != null) {
                user.setRole(role);
            }
        }
        if (user.getBranch() == null) {
            Branch branch = entityManager.find(Branch.class, 1L);
            if (branch != null) {
                user.setBranch(branch);
            }
        }

        userRepository.save(user);
    }

    private void seedMenuData() {
        Branch branch1 = branchRepository.findById(1L).orElse(null);
        if (branch1 == null) return;

        // Categories
        MenuCategory catStarters = getOrCreateCategory(branch1, "Starters & Appetizers", 1);
        MenuCategory catMains = getOrCreateCategory(branch1, "Main Courses", 2);
        MenuCategory catPizza = getOrCreateCategory(branch1, "Wood-Fired Pizza", 3);
        MenuCategory catBurgers = getOrCreateCategory(branch1, "Gourmet Burgers", 4);
        MenuCategory catDesserts = getOrCreateCategory(branch1, "Desserts", 5);
        MenuCategory catDrinks = getOrCreateCategory(branch1, "Beverages", 6);

        // Starters & Appetizers
        getOrCreateMenuItem(catStarters, "Crispy Calamari", "Tender calamari lightly breaded and fried, served with spicy marinara sauce.", 12.99, "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500", 10, "KITCHEN");
        getOrCreateMenuItem(catStarters, "Truffle Parmesan Fries", "Hand-cut fries tossed in white truffle oil, grated parmesan, and fresh parsley.", 8.50, "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500", 8, "KITCHEN");
        getOrCreateMenuItem(catStarters, "Classic Caesar Salad", "Crisp romaine lettuce, garlic croutons, shaved parmesan, and homemade Caesar dressing.", 10.00, "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500", 7, "COLD_PREP");
        getOrCreateMenuItem(catStarters, "Garlic Butter Bruschetta", "Toasted artisan sourdough topped with diced tomatoes, garlic, basil, and balsamic glaze.", 9.50, "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=500", 8, "COLD_PREP");
        getOrCreateMenuItem(catStarters, "Buffalo Chicken Wings", "Crispy fried wings tossed in classic spicy buffalo sauce, served with blue cheese dip.", 13.50, "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500", 12, "KITCHEN");
        getOrCreateMenuItem(catStarters, "Loaded Mozzarella Sticks", "Golden fried mozzarella cheese sticks served with warm herb marinara sauce.", 9.99, "https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=500", 8, "KITCHEN");
        getOrCreateMenuItem(catStarters, "Spicy Tuna Sushi Roll", "Fresh yellowfin tuna, spicy mayo, cucumber, topped with sesame seeds and sriracha.", 14.50, "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500", 10, "COLD_PREP");
        getOrCreateMenuItem(catStarters, "Dynamite Shrimp", "Crispy tempura shrimp tossed in a sweet and spicy dynamite sauce over mixed greens.", 16.00, "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500", 12, "KITCHEN");

        // Main Courses
        getOrCreateMenuItem(catMains, "Grilled Ribeye Steak", "12oz Prime Angus ribeye cooked to perfection, served with garlic herb butter and roasted asparagus.", 34.99, "https://images.unsplash.com/photo-1544025162-d76694265947?w=500", 20, "GRILL");
        getOrCreateMenuItem(catMains, "Pan-Seared Atlantic Salmon", "Fresh salmon fillet served over lemon risotto and asparagus with lemon butter sauce.", 26.50, "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500", 18, "GRILL");
        getOrCreateMenuItem(catMains, "Fettuccine Chicken Alfredo", "Creamy parmesan alfredo sauce tossed with grilled chicken breast and fresh fettuccine.", 18.99, "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500", 15, "KITCHEN");
        getOrCreateMenuItem(catMains, "Spaghetti Italian Bolognese", "Classic slow-simmered beef ragu sauce over aldente spaghetti with fresh parmesan.", 16.99, "https://images.unsplash.com/photo-1621996346565-e3d5d6281290?w=500", 14, "KITCHEN");
        getOrCreateMenuItem(catMains, "Grilled Chicken Teriyaki Bowl", "Tender chicken thighs glazed in teriyaki sauce with steamed jasmine rice & vegetables.", 19.50, "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500", 15, "GRILL");
        getOrCreateMenuItem(catMains, "Signature Lobster Ravioli", "Handmade ravioli stuffed with Maine lobster in a rich creamy vodka sauce.", 28.50, "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500", 20, "KITCHEN");
        getOrCreateMenuItem(catMains, "Slow-Cooked BBQ Ribs", "Fall-off-the-bone pork ribs glazed in our house smokey BBQ sauce with rustic fries.", 32.00, "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500", 25, "GRILL");

        // Wood-Fired Pizza
        getOrCreateMenuItem(catPizza, "Margherita Pizza", "San Marzano tomato sauce, fresh mozzarella, basil leaves, and extra virgin olive oil.", 14.99, "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500", 12, "PIZZA_OVEN");
        getOrCreateMenuItem(catPizza, "Pepperoni Feast Pizza", "Loaded with Italian pepperoni, spicy sausage, mozzarella, and house pizza sauce.", 17.50, "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500", 12, "PIZZA_OVEN");
        getOrCreateMenuItem(catPizza, "BBQ Chicken Pizza", "Grilled chicken, smoky BBQ sauce, red onion, cilantro, and smoked gouda.", 18.50, "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500", 14, "PIZZA_OVEN");
        getOrCreateMenuItem(catPizza, "Quattro Formaggi Four Cheese", "Blend of mozzarella, gorgonzola, parmesan, and fontina cheese on olive oil crust.", 17.99, "https://images.unsplash.com/photo-1573821663912-569905455b1c?w=500", 12, "PIZZA_OVEN");
        getOrCreateMenuItem(catPizza, "Hawaiian Supreme Pizza", "Smoked ham, fresh sweet pineapple chunks, mozzarella cheese, and tomato sauce.", 16.99, "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500", 12, "PIZZA_OVEN");
        getOrCreateMenuItem(catPizza, "Truffle Wild Mushroom Pizza", "Roasted wild mushrooms, white truffle oil, fontina cheese, and fresh thyme.", 19.99, "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500", 14, "PIZZA_OVEN");

        // Gourmet Burgers
        getOrCreateMenuItem(catBurgers, "Smokey Bacon Cheeseburger", "Angus beef patty, smoked bacon, cheddar cheese, crispy onions & house BBQ sauce.", 15.99, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500", 12, "GRILL");
        getOrCreateMenuItem(catBurgers, "Double Angus Smash Burger", "Two seared Angus beef patties, double American cheese, pickles & special sauce.", 17.50, "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500", 12, "GRILL");
        getOrCreateMenuItem(catBurgers, "Crispy Spicy Chicken Burger", "Buttermilk fried chicken breast, spicy mayo, coleslaw & pickles on brioche bun.", 14.99, "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500", 12, "KITCHEN");
        getOrCreateMenuItem(catBurgers, "Truffle Mushroom Swiss Burger", "Angus patty topped with sautéed wild mushrooms, Swiss cheese & truffle aioli.", 16.99, "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500", 14, "GRILL");
        getOrCreateMenuItem(catBurgers, "Premium Wagyu Gold Burger", "8oz Wagyu beef patty, caramelized onions, aged gruyere cheese, and black garlic mayo.", 24.50, "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500", 15, "GRILL");

        // Desserts
        getOrCreateMenuItem(catDesserts, "Classic Tiramisu", "Traditional Italian espresso-soaked ladyfingers with mascarpone cream and cocoa dusting.", 7.99, "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500", 5, "COLD_PREP");
        getOrCreateMenuItem(catDesserts, "Chocolate Lava Cake", "Warm chocolate molten cake served with a scoop of vanilla bean ice cream.", 8.99, "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500", 10, "KITCHEN");
        getOrCreateMenuItem(catDesserts, "New York Strawberry Cheesecake", "Rich creamy cheesecake topped with fresh strawberry compote and graham crust.", 8.50, "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=500", 5, "COLD_PREP");
        getOrCreateMenuItem(catDesserts, "Vanilla Bean Ice Cream Sundae", "Three scoops of Madagascar vanilla bean ice cream with hot fudge & maraschino cherry.", 6.50, "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500", 5, "COLD_PREP");
        getOrCreateMenuItem(catDesserts, "Matcha Green Tea Mochi", "Soft and chewy Japanese mochi filled with premium matcha green tea ice cream.", 7.50, "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500", 5, "COLD_PREP");
        getOrCreateMenuItem(catDesserts, "Artisan French Macarons", "Selection of 5 colorful French macarons including pistachio, raspberry, and lemon.", 9.50, "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=500", 5, "COLD_PREP");

        // Beverages
        getOrCreateMenuItem(catDrinks, "Iced Passion Fruit Tea", "Refreshing black tea infused with passion fruit and fresh mint.", 4.50, "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500", 3, "BAR");
        getOrCreateMenuItem(catDrinks, "Double Espresso", "Rich and intense double shot of house blend espresso.", 3.50, "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500", 3, "BAR");
        getOrCreateMenuItem(catDrinks, "Craft IPA Beer", "Local brewery India Pale Ale with citrus and pine notes.", 7.00, "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500", 2, "BAR");
        getOrCreateMenuItem(catDrinks, "Fresh Lemon Mint Mojito", "Sparkling muddled lemon juice, fresh mint leaves, cane sugar and crushed ice.", 5.50, "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500", 4, "BAR");
        getOrCreateMenuItem(catDrinks, "Fresh Mango Passion Smoothie", "Blended fresh Alphonso mangoes, passion fruit juice, and Greek yogurt.", 6.00, "https://images.unsplash.com/photo-1546173159-315724a31696?w=500", 4, "BAR");

        System.out.println(">>> Menu categories & menu items initialized successfully!");
    }

    private void seedTablesData() {
        Branch branch1 = branchRepository.findById(1L).orElse(null);
        if (branch1 == null) return;

        createTableIfNotExists(branch1, "T-01", 4, "Main Dining Hall", "FREE", 100.0, 100.0);
        createTableIfNotExists(branch1, "T-02", 4, "Main Dining Hall", "OCCUPIED", 300.0, 100.0);
        createTableIfNotExists(branch1, "T-03", 2, "Main Dining Hall", "FREE", 500.0, 100.0);
        createTableIfNotExists(branch1, "T-04", 6, "Main Dining Hall", "RESERVED", 100.0, 300.0);
        createTableIfNotExists(branch1, "VIP-01", 8, "VIP Lounge", "FREE", 300.0, 300.0);
        createTableIfNotExists(branch1, "VIP-02", 4, "VIP Lounge", "OCCUPIED", 500.0, 300.0);
        createTableIfNotExists(branch1, "OUT-01", 4, "Patio Garden", "FREE", 100.0, 500.0);
        createTableIfNotExists(branch1, "BAR-01", 2, "Bar Counter", "FREE", 300.0, 500.0);

        System.out.println(">>> Dining tables initialized successfully!");
    }

    private void seedCustomersData() {
        createCustomerIfNotExists("Charlie Customer", "0771234567", "customer@pos.com", "123 Main St, Colombo", 150);
        createCustomerIfNotExists("Nimal Perera", "0712345678", "nimal@gmail.com", "45 Galle Rd, Dehiwala", 240);
        createCustomerIfNotExists("Sunethra Silva", "0723456789", "sunethra@yahoo.com", "88 Kandy Rd, Kiribathgoda", 90);
        createCustomerIfNotExists("Kasun Jayawardena", "0754567890", "kasun@pos.com", "12 Highlevel Rd, Maharagama", 420);
        createCustomerIfNotExists("Dilini Fernando", "0765678901", "dilini@gmail.com", "77 Negombo Rd, Ja-Ela", 180);

        System.out.println(">>> Sample customers initialized successfully!");
    }

    private void seedIngredientsData() {
        Branch branch1 = branchRepository.findById(1L).orElse(null);
        if (branch1 == null) return;

        createIngredientIfNotExists(branch1, "Boneless Chicken Breast", "kg", 18.5, 5.0);
        createIngredientIfNotExists(branch1, "Prime Angus Beef Patty", "kg", 25.0, 8.0);
        createIngredientIfNotExists(branch1, "Fresh Mozzarella Cheese", "kg", 14.0, 4.0);
        createIngredientIfNotExists(branch1, "Roma Tomatoes", "kg", 30.0, 10.0);
        createIngredientIfNotExists(branch1, "White Truffle Oil", "l", 4.5, 1.0);
        createIngredientIfNotExists(branch1, "Espresso Coffee Beans", "kg", 12.0, 3.0);
        createIngredientIfNotExists(branch1, "Italian Wheat Flour", "kg", 45.0, 15.0);
        createIngredientIfNotExists(branch1, "Idaho Russet Potatoes", "kg", 40.0, 10.0);
        createIngredientIfNotExists(branch1, "Fettuccine Pasta", "kg", 22.0, 5.0);

        System.out.println(">>> Inventory ingredients initialized successfully!");
    }

    private MenuCategory getOrCreateCategory(Branch branch, String name, int sortOrder) {
        List<MenuCategory> categories = menuCategoryRepository.findByBranchIdOrderBySortOrderAsc(branch.getId());
        for (MenuCategory cat : categories) {
            if (cat.getName().equalsIgnoreCase(name)) {
                return cat;
            }
        }
        MenuCategory newCat = new MenuCategory();
        newCat.setBranch(branch);
        newCat.setName(name);
        newCat.setSortOrder(sortOrder);
        return menuCategoryRepository.save(newCat);
    }

    private void getOrCreateMenuItem(MenuCategory category, String name, String description, double price, String imageUrl, int prepTimeMin, String station) {
        List<MenuItem> existingItems = menuItemRepository.findByCategoryId(category.getId());
        for (MenuItem item : existingItems) {
            if (item.getName().equalsIgnoreCase(name)) {
                return;
            }
        }
        MenuItem item = new MenuItem();
        item.setCategory(category);
        item.setName(name);
        item.setDescription(description);
        item.setPrice(BigDecimal.valueOf(price));
        item.setImageUrl(imageUrl);
        item.setPrepTimeMin(prepTimeMin);
        item.setStation(station);
        item.setIsAvailable(true);
        menuItemRepository.save(item);
    }

    private void createTableIfNotExists(Branch branch, String tableNum, int capacity, String zone, String status, double posX, double posY) {
        List<TableEntity> existing = tableRepository.findByBranchId(branch.getId());
        for (TableEntity t : existing) {
            if (t.getTableNumber().equalsIgnoreCase(tableNum)) {
                return;
            }
        }
        TableEntity table = TableEntity.builder()
                .branch(branch)
                .tableNumber(tableNum)
                .capacity(capacity)
                .zone(zone)
                .status(status)
                .positionX(posX)
                .positionY(posY)
                .build();
        tableRepository.save(table);
    }

    private void createCustomerIfNotExists(String name, String phone, String email, String address, int points) {
        if (customerRepository.findByEmail(email).isPresent() || customerRepository.findByPhone(phone).isPresent()) return;

        Customer customer = Customer.builder()
                .name(name)
                .phone(phone)
                .email(email)
                .address(address)
                .loyaltyPoints(points)
                .build();
        customerRepository.save(customer);
    }

    private void createIngredientIfNotExists(Branch branch, String name, String unit, double currentStock, double reorderLevel) {
        List<Ingredient> existing = ingredientRepository.findByBranchId(branch.getId());
        for (Ingredient ing : existing) {
            if (ing.getName().equalsIgnoreCase(name)) {
                return;
            }
        }
        Ingredient ing = Ingredient.builder()
                .branch(branch)
                .name(name)
                .unit(unit)
                .currentStock(BigDecimal.valueOf(currentStock))
                .reorderLevel(BigDecimal.valueOf(reorderLevel))
                .build();
        ingredientRepository.save(ing);
    }
}
