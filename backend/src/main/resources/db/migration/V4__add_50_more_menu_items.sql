-- =========================================
-- V4__add_50_more_menu_items.sql
-- 50 New Food & Beverage Items (IDs 31 to 80)
-- =========================================

-- 1. Ensure Categories 1-9 Exist
INSERT INTO menu_categories (id, branch_id, name, sort_order) VALUES
(1, 1, 'Starters & Appetizers', 1),
(2, 1, 'Main Courses', 2),
(3, 1, 'Wood-Fired Pizza', 3),
(4, 1, 'Gourmet Burgers', 4),
(5, 1, 'Desserts', 5),
(6, 1, 'Beverages', 6),
(7, 1, 'Seafood Specialties', 7),
(8, 1, 'Pasta & Risotto', 8),
(9, 1, 'Cocktails & Wines', 9)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

-- 2. Insert / Update 50 New Menu Items (IDs 31-80)
INSERT INTO menu_items (id, category_id, name, description, price, image_url, is_available, prep_time_min, station) VALUES
-- Starters & Appetizers (31-36)
(31, 1, 'Crispy Onion Rings', 'Golden battered onion rings served with zesty horseradish dip.', 7.99, 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=500', true, 6, 'KITCHEN'),
(32, 1, 'Spinach & Artichoke Dip', 'Warm creamy spinach and artichoke dip served with crispy tortilla chips.', 11.50, 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=500', true, 9, 'KITCHEN'),
(33, 1, 'Stuffed Jalapeño Poppers', 'Spicy jalapeños stuffed with cream cheese and wrapped in crispy bacon.', 10.50, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500', true, 8, 'KITCHEN'),
(34, 1, 'Caprese Skewers', 'Fresh cherry tomatoes, mozzarella pearls, and basil drizzled with aged balsamic.', 9.99, 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19655?w=500', true, 5, 'COLD_PREP'),
(35, 1, 'Shrimp Cocktail', 'Jumbo chilled tiger shrimp served with spicy horseradish cocktail sauce and lemon.', 14.99, 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=500', true, 6, 'COLD_PREP'),
(36, 1, 'Crispy Vegetable Spring Rolls', 'Hand-rolled Asian spring rolls stuffed with veggies, served with sweet chili dip.', 8.99, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500', true, 7, 'KITCHEN'),

-- Main Courses (37-43)
(37, 2, 'Slow-Roasted Prime Rib', '14oz slow-roasted beef rib with au jus, horseradish cream, and mashed potatoes.', 36.99, 'https://images.unsplash.com/photo-1558030006-450675393462?w=500', true, 20, 'GRILL'),
(38, 2, 'Chicken Parmesan Supreme', 'Breaded chicken breast topped with marinara, melted mozzarella, over linguine.', 21.50, 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=500', true, 16, 'KITCHEN'),
(39, 2, 'Beef Tenderloin Filet Mignon', '8oz center-cut filet mignon served with truffle butter and red wine reduction.', 38.50, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500', true, 22, 'GRILL'),
(40, 2, 'Rosemary Braised Lamb Shanks', 'Tender lamb shanks slow-braised in red wine and rosemary, served over polenta.', 29.99, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500', true, 25, 'KITCHEN'),
(41, 2, 'Crispy Duck Breast', 'Pan-seared duck breast with cherry reduction, wild rice, and roasted carrots.', 27.99, 'https://images.unsplash.com/photo-1514944298341-9ebb685ee5b6?w=500', true, 18, 'GRILL'),
(42, 2, 'Smokey BBQ Beef Brisket', '12-hour smoked beef brisket smothered in house BBQ sauce with coleslaw and corn.', 24.99, 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500', true, 15, 'GRILL'),
(43, 2, 'Crispy Tofu Stir-Fry', 'Crispy organic tofu stir-fried with snap peas, bell peppers, and sesame ginger sauce.', 17.50, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500', true, 12, 'KITCHEN'),

-- Wood-Fired Pizza (44-49)
(44, 3, 'Prosciutto & Arugula Pizza', 'Prosciutto di Parma, fresh arugula, shaved parmesan, mozzarella & garlic oil.', 19.50, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500', true, 12, 'PIZZA_OVEN'),
(45, 3, 'Spicy Diablo Pepperoni Pizza', 'Double spicy pepperoni, jalapeños, chili flakes, mozzarella & hot honey drizzle.', 18.99, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500', true, 12, 'PIZZA_OVEN'),
(46, 3, 'White Garlic Spinach Pizza', 'Creamy ricotta, roasted garlic, baby spinach, mozzarella, and extra virgin olive oil.', 16.50, 'https://images.unsplash.com/photo-1573821663912-569905455b1c?w=500', true, 12, 'PIZZA_OVEN'),
(47, 3, 'Carnivore Meat Lovers Pizza', 'Pepperoni, Italian sausage, smoked bacon, ham, meatballs & mozzarella cheese.', 20.99, 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500', true, 14, 'PIZZA_OVEN'),
(48, 3, 'Garden Veggie Feast Pizza', 'Bell peppers, red onions, mushrooms, black olives, tomatoes & mozzarella.', 15.99, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500', true, 12, 'PIZZA_OVEN'),
(49, 3, 'Smoked Salmon Capers Pizza', 'Smoked Atlantic salmon, cream cheese spread, capers, red onion & fresh dill.', 21.50, 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500', true, 14, 'PIZZA_OVEN'),

-- Gourmet Burgers (50-55)
(50, 4, 'Avocado Bacon Turkey Burger', 'Juicy turkey patty, fresh avocado, smoked bacon, lettuce & herb mayo.', 15.50, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', true, 12, 'GRILL'),
(51, 4, 'Bourbon BBQ Western Burger', 'Angus beef, bourbon BBQ sauce, cheddar, onion rings & smoked bacon.', 16.99, 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500', true, 12, 'GRILL'),
(52, 4, 'Spicy Jalapeño Crunch Burger', 'Angus beef, pepper jack cheese, fried jalapeños, spicy aioli & lettuce.', 15.99, 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500', true, 12, 'GRILL'),
(53, 4, 'Ultimate Plant-Based Burger', 'Beyond meat patty, vegan cheese, grilled onions, tomato & special sauce.', 16.50, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500', true, 12, 'GRILL'),
(54, 4, 'Mushroom Black Truffle Melt', 'Angus patty, sauteed Portobello mushrooms, Swiss cheese & black truffle butter.', 17.99, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', true, 14, 'GRILL'),
(55, 4, 'Blue Cheese Bacon Burger', 'Angus beef, crumbled Danish blue cheese, caramelized onions & bacon.', 16.99, 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500', true, 12, 'GRILL'),

-- Desserts (56-60)
(56, 5, 'New York Blueberry Cheesecake', 'Creamy cheesecake topped with wild blueberry sauce & graham crust.', 8.99, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500', true, 5, 'COLD_PREP'),
(57, 5, 'Warm Apple Cinnamon Pie', 'Fresh baked apple pie served warm with a scoop of vanilla ice cream.', 7.99, 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=500', true, 8, 'KITCHEN'),
(58, 5, 'Salted Caramel Brownie Sundae', 'Fudge brownie topped with salted caramel drizzle, pecans & ice cream.', 8.50, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500', true, 6, 'COLD_PREP'),
(59, 5, 'Matcha Green Tea Mousse', 'Light Japanese matcha green tea mousse with white chocolate shavings.', 7.50, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500', true, 5, 'COLD_PREP'),
(60, 5, 'Classic Belgian Waffle', 'Warm Belgian waffle topped with Belgian dark chocolate sauce & fresh berries.', 9.50, 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500', true, 9, 'KITCHEN'),

-- Beverages (61-66)
(61, 6, 'Cold Brew Nitro Coffee', 'Smooth nitrogen-infused cold brew coffee served over ice.', 4.99, 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500', true, 2, 'BAR'),
(62, 6, 'Fresh Berry Lemonade', 'Muddled strawberries, raspberries, fresh lemon juice & sparkling soda.', 4.75, 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=500', true, 3, 'BAR'),
(63, 6, 'Iced Matcha Latte', 'Japanese Uji matcha green tea whisked with milk and sweet honey over ice.', 5.25, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500', true, 3, 'BAR'),
(64, 6, 'Peach Italian Sparkling Soda', 'Crisp Italian sparkling water infused with white peach syrup & mint.', 4.25, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500', true, 2, 'BAR'),
(65, 6, 'Craft Wheat Draft Beer', 'Unfiltered Bavarian style wheat beer with notes of clove and banana.', 7.50, 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500', true, 2, 'BAR'),
(66, 6, 'Organic Green Detox Juice', 'Freshly pressed kale, green apple, cucumber, celery & ginger.', 6.50, 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=500', true, 4, 'BAR'),

-- Seafood Specialties (67-71)
(67, 7, 'Pan-Seared Sea Bass', 'Fresh Chilean sea bass with saffron butter sauce and asparagus.', 34.99, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500', true, 20, 'GRILL'),
(68, 7, 'Garlic Butter Lobster Tail', 'Broiled 8oz Maine lobster tail brushed with garlic herb butter.', 39.99, 'https://images.unsplash.com/photo-1559737671-933e49e29a99?w=500', true, 18, 'GRILL'),
(69, 7, 'Grilled Jumbo King Prawns', 'Charbroiled king prawns with garlic, chili oil, and charred lemon.', 28.50, 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=500', true, 16, 'GRILL'),
(70, 7, 'Seafood Paella Valenciana', 'Saffron rice with tiger shrimp, calamari, mussels, and chorizo.', 31.99, 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=500', true, 22, 'KITCHEN'),
(71, 7, 'Crispy Fish & Chips', 'Beer-battered Atlantic cod served with sea salt fries & tartar sauce.', 18.99, 'https://images.unsplash.com/photo-1579631542720-3a87824fff86?w=500', true, 14, 'KITCHEN'),

-- Pasta & Risotto (72-76)
(72, 8, 'Wild Mushroom Truffle Risotto', 'Creamy Arborio rice with porcini mushrooms, white truffle oil & parmesan.', 22.50, 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=500', true, 18, 'KITCHEN'),
(73, 8, 'Seafood Linguine Frutti di Mare', 'Linguine tossed with shrimp, scallops, mussels & spicy tomato sauce.', 25.99, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', true, 16, 'KITCHEN'),
(74, 8, 'Classic Penne Arrabbiata', 'Penne pasta in spicy garlic tomato sauce with fresh basil & parmesan.', 15.99, 'https://images.unsplash.com/photo-1621996346565-e3d5d6281290?w=500', true, 12, 'KITCHEN'),
(75, 8, 'Spinach & Ricotta Ravioli', 'Handmade ravioli stuffed with ricotta & spinach in sage butter sauce.', 18.50, 'https://images.unsplash.com/photo-1587740896284-469b61d43a85?w=500', true, 14, 'KITCHEN'),
(76, 8, 'Lobster Macaroni & Cheese', 'Elbow macaroni in four-cheese sauce with fresh lobster meat & herb crust.', 23.99, 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500', true, 15, 'KITCHEN'),

-- Cocktails & Wines (77-80)
(77, 9, 'Classic Espresso Martini', 'Vodka, fresh espresso, Kahlúa liqueur, and simple syrup shaken.', 13.50, 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500', true, 4, 'BAR'),
(78, 9, 'Smoked Old Fashioned', 'Bourbon whiskey, Angostura bitters, orange peel, and hickory smoke.', 14.99, 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500', true, 4, 'BAR'),
(79, 9, 'Aperol Spritz', 'Aperol, Prosecco, sparkling soda, and a fresh orange slice.', 12.00, 'https://images.unsplash.com/photo-1560512823-829485b8bf24?w=500', true, 3, 'BAR'),
(80, 9, 'Napa Valley Cabernet Sauvignon', 'Glass of premium California Napa Valley red wine with oak notes.', 15.00, 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500', true, 2, 'BAR')
ON CONFLICT (id) DO UPDATE SET 
  category_id = EXCLUDED.category_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  is_available = EXCLUDED.is_available,
  prep_time_min = EXCLUDED.prep_time_min,
  station = EXCLUDED.station;
