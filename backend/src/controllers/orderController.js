const db = require('../config/database');

const getOrders = async (req, res, next) => {
  try {
    const { status, table_id, date } = req.query;
    
    let query = `
      SELECT o.*, t.table_number, u.username as cashier_name,
             COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN tables t ON o.table_id = t.id
      LEFT JOIN users u ON o.cashier_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND o.status = ?';
      params.push(status);
    }

    if (table_id) {
      query += ' AND o.table_id = ?';
      params.push(table_id);
    }

    if (date) {
      query += ' AND DATE(o.created_at) = ?';
      params.push(date);
    }

    query += ' GROUP BY o.id ORDER BY o.created_at DESC';

    const [orders] = await db.execute(query, params);
    res.json({ orders });
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [orders] = await db.execute(`
      SELECT o.*, t.table_number, u.username as cashier_name
      FROM orders o
      LEFT JOIN tables t ON o.table_id = t.id
      LEFT JOIN users u ON o.cashier_id = u.id
      WHERE o.id = ?
    `, [id]);

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const [orderItems] = await db.execute(`
      SELECT oi.*, mi.name, mi.price
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE oi.order_id = ?
    `, [id]);

    res.json({
      order: {
        ...orders[0],
        items: orderItems
      }
    });
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req, res, next) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { table_id, items, notes } = req.body;
    const cashier_id = req.user.id;

    // Calculate total
    let total = 0;
    const itemsWithPrices = [];

    for (const item of items) {
      const [menuItems] = await connection.execute(
        'SELECT id, name, price, available FROM menu_items WHERE id = ?',
        [item.menu_item_id]
      );

      if (menuItems.length === 0) {
        throw new Error(`Menu item with ID ${item.menu_item_id} not found`);
      }

      if (!menuItems[0].available) {
        throw new Error(`Menu item ${menuItems[0].name} is not available`);
      }

      const itemTotal = menuItems[0].price * item.quantity;
      total += itemTotal;

      itemsWithPrices.push({
        ...item,
        price: menuItems[0].price,
        subtotal: itemTotal
      });
    }

    // Create order
    const [orderResult] = await connection.execute(
      'INSERT INTO orders (table_id, cashier_id, total_amount, notes, status) VALUES (?, ?, ?, ?, ?)',
      [table_id, cashier_id, total, notes || '', 'pending']
    );

    const orderId = orderResult.insertId;

    // Create order items
    for (const item of itemsWithPrices) {
      await connection.execute(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, price, subtotal, notes) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, item.menu_item_id, item.quantity, item.price, item.subtotal, item.notes || '']
      );
    }

    // Update table status
    await connection.execute(
      'UPDATE tables SET status = ? WHERE id = ?',
      ['occupied', table_id]
    );

    await connection.commit();

    // Fetch the created order with details
    const [newOrder] = await db.execute(`
      SELECT o.*, t.table_number, u.username as cashier_name
      FROM orders o
      LEFT JOIN tables t ON o.table_id = t.id
      LEFT JOIN users u ON o.cashier_id = u.id
      WHERE o.id = ?
    `, [orderId]);

    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder[0]
    });

  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const [result] = await db.execute(
      'UPDATE orders SET status = ?, notes = ? WHERE id = ?',
      [status, notes || '', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // If order is completed, free up the table
    if (status === 'completed') {
      const [orders] = await db.execute('SELECT table_id FROM orders WHERE id = ?', [id]);
      if (orders.length > 0) {
        await db.execute(
          'UPDATE tables SET status = ? WHERE id = ?',
          ['available', orders[0].table_id]
        );
      }
    }

    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    next(error);
  }
};

const processPayment = async (req, res, next) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { id } = req.params;
    const { payment_method, amount_received } = req.body;

    // Get order details
    const [orders] = await connection.execute(
      'SELECT * FROM orders WHERE id = ? AND status = ?',
      [id, 'pending']
    );

    if (orders.length === 0) {
      throw new Error('Order not found or already paid');
    }

    const order = orders[0];
    
    if (amount_received < order.total_amount) {
      throw new Error('Insufficient payment amount');
    }

    const change = amount_received - order.total_amount;

    // Create payment record
    await connection.execute(
      'INSERT INTO payments (order_id, amount, payment_method, amount_received, change_amount, processed_by) VALUES (?, ?, ?, ?, ?, ?)',
      [id, order.total_amount, payment_method, amount_received, change, req.user.id]
    );

    // Update order status
    await connection.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      ['paid', id]
    );

    // Free up table
    await connection.execute(
      'UPDATE tables SET status = ? WHERE id = ?',
      ['available', order.table_id]
    );

    await connection.commit();

    res.json({
      message: 'Payment processed successfully',
      payment: {
        amount: order.total_amount,
        amount_received,
        change,
        payment_method
      }
    });

  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  processPayment
};