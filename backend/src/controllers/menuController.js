const db = require('../config/database');

const getMenuItems = async (req, res, next) => {
  try {
    const { category, available } = req.query;
    
    let query = 'SELECT * FROM menu_items WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (available !== undefined) {
      query += ' AND available = ?';
      params.push(available === 'true');
    }

    query += ' ORDER BY category, name';

    const [items] = await db.execute(query, params);
    res.json({ items });
  } catch (error) {
    next(error);
  }
};

const getMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const [items] = await db.execute(
      'SELECT * FROM menu_items WHERE id = ?',
      [id]
    );

    if (items.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ item: items[0] });
  } catch (error) {
    next(error);
  }
};

const createMenuItem = async (req, res, next) => {
  try {
    const { name, description, price, category, available, image_url } = req.body;

    const [result] = await db.execute(
      `INSERT INTO menu_items (name, description, price, category, available, image_url) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description || '', price, category, available !== false, image_url || '']
    );

    const [newItem] = await db.execute(
      'SELECT * FROM menu_items WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Menu item created successfully',
      item: newItem[0]
    });
  } catch (error) {
    next(error);
  }
};

const updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, available, image_url } = req.body;

    const [result] = await db.execute(
      `UPDATE menu_items 
       SET name = ?, description = ?, price = ?, category = ?, available = ?, image_url = ?
       WHERE id = ?`,
      [name, description || '', price, category, available !== false, image_url || '', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const [updatedItem] = await db.execute(
      'SELECT * FROM menu_items WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Menu item updated successfully',
      item: updatedItem[0]
    });
  } catch (error) {
    next(error);
  }
};

const deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      'DELETE FROM menu_items WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const [categories] = await db.execute(
      'SELECT DISTINCT category FROM menu_items ORDER BY category'
    );

    res.json({ 
      categories: categories.map(row => row.category) 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getCategories
};