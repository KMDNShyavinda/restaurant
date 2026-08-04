-- =========================================
-- V3__add_expanded_menu_items.sql
-- Expanded Menu Categories and Food Items
-- =========================================

-- 1. Ensure Categories Exist
INSERT INTO menu_categories (id, branch_id, name, sort_order) VALUES
(1, 1, 'Starters & Appetizers', 1),
(2, 1, 'Main Courses', 2),
(3, 1, 'Wood-Fired Pizza', 3),
(4, 1, 'Gourmet Burgers', 4),
(5, 1, 'Desserts', 5),
(6, 1, 'Beverages', 6)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

-- 2. Insert / Update All Food Menu Items
INSERT INTO menu_items (id, category_id, name, description, price, image_url, is_available, prep_time_min, station) VALUES
-- Starters & Appetizers
(1, 1, 'Crispy Calamari', 'Tender calamari lightly breaded and fried, served with spicy marinara sauce.', 12.99, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500', true, 10, 'KITCHEN'),
(2, 1, 'Truffle Parmesan Fries', 'Hand-cut fries tossed in white truffle oil, grated parmesan, and fresh parsley.', 8.50, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500', true, 8, 'KITCHEN'),
(3, 1, 'Classic Caesar Salad', 'Crisp romaine lettuce, garlic croutons, shaved parmesan, and homemade Caesar dressing.', 10.00, 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500', true, 7, 'COLD_PREP'),
(4, 1, 'Garlic Butter Bruschetta', 'Toasted artisan sourdough topped with diced tomatoes, garlic, basil, and balsamic glaze.', 9.50, 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=500', true, 8, 'COLD_PREP'),
(5, 1, 'Buffalo Chicken Wings', 'Crispy fried wings tossed in classic spicy buffalo sauce, served with blue cheese dip.', 13.50, 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500', true, 12, 'KITCHEN'),
(6, 1, 'Loaded Mozzarella Sticks', 'Golden fried mozzarella cheese sticks served with warm herb marinara sauce.', 9.99, 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=500', true, 8, 'KITCHEN'),

-- Main Courses
(7, 2, 'Grilled Ribeye Steak', '12oz Prime Angus ribeye cooked to perfection, served with garlic herb butter and roasted asparagus.', 34.99, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500', true, 20, 'GRILL'),
(8, 2, 'Pan-Seared Atlantic Salmon', 'Fresh salmon fillet served over lemon risotto and asparagus with lemon butter sauce.', 26.50, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500', true, 18, 'GRILL'),
(9, 2, 'Fettuccine Chicken Alfredo', 'Creamy parmesan alfredo sauce tossed with grilled chicken breast and fresh fettuccine.', 18.99, 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500', true, 15, 'KITCHEN'),
(10, 2, 'Spaghetti Italian Bolognese', 'Classic slow-simmered beef ragu sauce over aldente spaghetti with fresh parmesan.', 16.99, 'https://images.unsplash.com/photo-1621996346565-e3d5d6281290?w=500', true, 14, 'KITCHEN'),
(11, 2, 'Grilled Chicken Teriyaki Bowl', 'Tender chicken thighs glazed in teriyaki sauce with steamed jasmine rice & vegetables.', 19.50, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500', true, 15, 'GRILL'),

-- Wood-Fired Pizza
(12, 3, 'Margherita Pizza', 'San Marzano tomato sauce, fresh mozzarella, basil leaves, and extra virgin olive oil.', 14.99, 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500', true, 12, 'PIZZA_OVEN'),
(13, 3, 'Pepperoni Feast Pizza', 'Loaded with Italian pepperoni, spicy sausage, mozzarella, and house pizza sauce.', 17.50, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500', true, 12, 'PIZZA_OVEN'),
(14, 3, 'BBQ Chicken Pizza', 'Grilled chicken, smoky BBQ sauce, red onion, cilantro, and smoked gouda.', 18.50, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500', true, 14, 'PIZZA_OVEN'),
(15, 3, 'Quattro Formaggi Four Cheese', 'Blend of mozzarella, gorgonzola, parmesan, and fontina cheese on olive oil crust.', 17.99, 'https://images.unsplash.com/photo-1573821663912-569905455b1c?w=500', true, 12, 'PIZZA_OVEN'),
(16, 3, 'Hawaiian Supreme Pizza', 'Smoked ham, fresh sweet pineapple chunks, mozzarella cheese, and tomato sauce.', 16.99, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500', true, 12, 'PIZZA_OVEN'),
(17, 3, 'Truffle Wild Mushroom Pizza', 'Roasted wild mushrooms, white truffle oil, fontina cheese, and fresh thyme.', 19.99, 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500', true, 14, 'PIZZA_OVEN'),

-- Gourmet Burgers
(18, 4, 'Smokey Bacon Cheeseburger', 'Angus beef patty, smoked bacon, cheddar cheese, crispy onions & house BBQ sauce.', 15.99, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', true, 12, 'GRILL'),
(19, 4, 'Double Angus Smash Burger', 'Two seared Angus beef patties, double American cheese, pickles & special sauce.', 17.50, 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500', true, 12, 'GRILL'),
(20, 4, 'Crispy Spicy Chicken Burger', 'Buttermilk fried chicken breast, spicy mayo, coleslaw & pickles on brioche bun.', 14.99, 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500', true, 12, 'KITCHEN'),
(21, 4, 'Truffle Mushroom Swiss Burger', 'Angus patty topped with sautéed wild mushrooms, Swiss cheese & truffle aioli.', 16.99, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500', true, 14, 'GRILL'),

-- Desserts
(22, 5, 'Classic Tiramisu', 'Traditional Italian espresso-soaked ladyfingers with mascarpone cream and cocoa dusting.', 7.99, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500', true, 5, 'COLD_PREP'),
(23, 5, 'Chocolate Lava Cake', 'Warm chocolate molten cake served with a scoop of vanilla bean ice cream.', 8.99, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500', true, 10, 'KITCHEN'),
(24, 5, 'New York Strawberry Cheesecake', 'Rich creamy cheesecake topped with fresh strawberry compote and graham crust.', 8.50, 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=500', true, 5, 'COLD_PREP'),
(25, 5, 'Vanilla Bean Ice Cream Sundae', 'Three scoops of Madagascar vanilla bean ice cream with hot fudge & maraschino cherry.', 6.50, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500', true, 5, 'COLD_PREP'),

-- Beverages
(26, 6, 'Iced Passion Fruit Tea', 'Refreshing black tea infused with passion fruit and fresh mint.', 4.50, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500', true, 3, 'BAR'),
(27, 6, 'Double Espresso', 'Rich and intense double shot of house blend espresso.', 3.50, 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500', true, 3, 'BAR'),
(28, 6, 'Craft IPA Beer', 'Local brewery India Pale Ale with citrus and pine notes.', 7.00, 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500', true, 2, 'BAR'),
(29, 6, 'Fresh Lemon Mint Mojito', 'Sparkling muddled lemon juice, fresh mint leaves, cane sugar and crushed ice.', 5.50, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500', true, 4, 'BAR'),
(30, 6, 'Fresh Mango Passion Smoothie', 'Blended fresh Alphonso mangoes, passion fruit juice, and Greek yogurt.', 6.00, 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500', true, 4, 'BAR')
ON CONFLICT (id) DO UPDATE SET 
  category_id = EXCLUDED.category_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  is_available = EXCLUDED.is_available,
  prep_time_min = EXCLUDED.prep_time_min,
  station = EXCLUDED.station;
