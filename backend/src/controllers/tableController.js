const db = require('../config/database');

const getTables = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    let query = `
      SELECT t.*, 
             CASE WHEN o.id IS NOT NULL THEN o.id ELSE NULL END as current_order_id,
             CASE WHEN o.id IS NOT NULL THEN o.total_amount ELSE NULL END as current_order_total
      FROM tables t
      LEFT JOIN orders o ON t.id = o.table_id AND o.status = 'pending'
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND t.status = ?';
      params.push(status);
    }

    query += ' ORDER BY t.table_number';

    const [tables] = await db.execute(query, params);
    res.json({ tables });
  } catch (error) {
    next(error);
  }
};

const getTable = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [tables] = await db.execute(
      'SELECT * FROM tables WHERE id = ?',
      [id]
    );

    if (tables.length === 0) {
      return res.status(404).json({ message: 'Table not found' });
    }

    res.json({ table: tables[0] });
  } catch (error) {
    next(error);
  }
};

const createTable = async (req, res, next) => {
  try {
    const { table_number, capacity } = req.body;

    const [result] = await db.execute(
      'INSERT INTO tables (table_number, capacity, status) VALUES (?, ?, ?)',
      [table_number, capacity || 4, 'available']
    );

    const [newTable] = await db.execute(
      'SELECT * FROM tables WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Table created successfully',
      table: newTable[0]
    });
  } catch (error) {
    next(error);
  }
};

const updateTable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { table_number, capacity, status } = req.body;

    const [result] = await db.execute(
      'UPDATE tables SET table_number = ?, capacity = ?, status = ? WHERE id = ?',
      [table_number, capacity, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Table not found' });
    }

    const [updatedTable] = await db.execute(
      'SELECT * FROM tables WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Table updated successfully',
      table: updatedTable[0]
    });
  } catch (error) {
    next(error);
  }
};

const deleteTable = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if table has pending orders
    const [orders] = await db.execute(
      'SELECT id FROM orders WHERE table_id = ? AND status = ?',
      [id, 'pending']
    );

    if (orders.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete table with pending orders' 
      });
    }

    const [result] = await db.execute(
      'DELETE FROM tables WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Table not found' });
    }

    res.json({ message: 'Table deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTables,
  getTable,
  createTable,
  updateTable,
  deleteTable
};