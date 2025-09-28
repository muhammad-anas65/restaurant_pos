-- Restaurant POS Seed Data
-- Sample data for testing and development

USE restaurant_pos;

-- Insert users (passwords are hashed with bcrypt, salt rounds: 10)
-- admin: admin123
-- cashier: cashier123
INSERT INTO users (username, password, role) VALUES
('admin', '$2a$10$rOzXvLEbgHcViMYz4DFZTetdqKqB9U5.wX9g1vq4PiPd1yF5vG2Ca', 'admin'),
('cashier', '$2a$10$wZfGvQcHeGHzPwCCUZYhgOCmVN7F8.VPYs5PgFyQ5uY/Q5ZiDKiDu', 'cashier');

-- Insert tables
INSERT INTO tables (table_number, capacity, status) VALUES
(1, 2, 'available'),
(2, 4, 'available'),
(3, 4, 'available'),
(4, 6, 'available'),
(5, 2, 'available'),
(6, 4, 'available'),
(7, 6, 'available'),
(8, 4, 'available'),
(9, 2, 'available'),
(10, 8, 'available');

-- Insert menu items
INSERT INTO menu_items (name, description, price, category, available) VALUES
-- Appetizers
('Chicken Wings', 'Crispy buffalo wings served with ranch dressing', 12.99, 'Appetizers', TRUE),
('Mozzarella Sticks', 'Golden fried mozzarella with marinara sauce', 9.99, 'Appetizers', TRUE),
('Nachos Supreme', 'Tortilla chips with cheese, jalapeños, and sour cream', 11.99, 'Appetizers', TRUE),
('Spinach Artichoke Dip', 'Creamy dip served with tortilla chips', 10.99, 'Appetizers', TRUE),
('Onion Rings', 'Beer-battered onion rings with chipotle mayo', 8.99, 'Appetizers', TRUE),

-- Main Course
('Classic Burger', 'Beef patty with lettuce, tomato, and pickles', 14.99, 'Main Course', TRUE),
('Grilled Chicken', 'Herb-seasoned chicken breast with vegetables', 18.99, 'Main Course', TRUE),
('Fish and Chips', 'Beer-battered cod with fries and tartar sauce', 16.99, 'Main Course', TRUE),
('Ribeye Steak', 'Grilled 12oz ribeye with mashed potatoes', 28.99, 'Main Course', TRUE),
('Pasta Carbonara', 'Creamy pasta with bacon and parmesan', 15.99, 'Main Course', TRUE),
('Caesar Salad', 'Romaine lettuce with caesar dressing and croutons', 12.99, 'Main Course', TRUE),
('BBQ Ribs', 'Full rack of ribs with BBQ sauce and coleslaw', 24.99, 'Main Course', TRUE),
('Vegetable Stir Fry', 'Mixed vegetables with teriyaki sauce over rice', 13.99, 'Main Course', TRUE),

-- Pizza
('Margherita Pizza', 'Fresh tomato, mozzarella, and basil', 16.99, 'Pizza', TRUE),
('Pepperoni Pizza', 'Classic pepperoni with mozzarella cheese', 18.99, 'Pizza', TRUE),
('Supreme Pizza', 'Pepperoni, sausage, peppers, onions, and mushrooms', 22.99, 'Pizza', TRUE),
('Hawaiian Pizza', 'Ham and pineapple with mozzarella cheese', 19.99, 'Pizza', TRUE),
('Meat Lovers Pizza', 'Pepperoni, sausage, bacon, and ham', 24.99, 'Pizza', TRUE),

-- Desserts
('Chocolate Cake', 'Rich chocolate layer cake with fudge frosting', 7.99, 'Desserts', TRUE),
('Cheesecake', 'New York style cheesecake with berry sauce', 6.99, 'Desserts', TRUE),
('Apple Pie', 'Homemade apple pie with vanilla ice cream', 6.99, 'Desserts', TRUE),
('Ice Cream Sundae', 'Vanilla ice cream with hot fudge and whipped cream', 5.99, 'Desserts', TRUE),
('Tiramisu', 'Italian coffee-flavored dessert', 8.99, 'Desserts', TRUE),

-- Beverages
('Coca Cola', 'Classic Coke', 2.99, 'Beverages', TRUE),
('Fresh Orange Juice', 'Freshly squeezed orange juice', 4.99, 'Beverages', TRUE),
('Coffee', 'Freshly brewed coffee', 2.99, 'Beverages', TRUE),
('Iced Tea', 'Sweet or unsweetened iced tea', 2.99, 'Beverages', TRUE),
('Craft Beer', 'Local craft beer selection', 5.99, 'Beverages', TRUE),
('House Wine', 'Red or white wine by the glass', 7.99, 'Beverages', TRUE),
('Mineral Water', 'Sparkling or still water', 3.99, 'Beverages', TRUE);