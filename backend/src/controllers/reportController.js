const db = require('../config/database');

const getDailySales = async (req, res, next) => {
  try {
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    // Daily summary
    const [summary] = await db.execute(`
      SELECT 
        COUNT(DISTINCT o.id) as total_orders,
        COALESCE(SUM(o.total_amount), 0) as total_revenue,
        COUNT(DISTINCT o.table_id) as tables_served,
        AVG(o.total_amount) as average_order_value
      FROM orders o
      WHERE DATE(o.created_at) = ? AND o.status IN ('paid', 'completed')
    `, [targetDate]);

    // Best selling items
    const [bestSelling] = await db.execute(`
      SELECT 
        mi.name,
        mi.category,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.subtotal) as total_revenue
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      JOIN orders o ON oi.order_id = o.id
      WHERE DATE(o.created_at) = ? AND o.status IN ('paid', 'completed')
      GROUP BY oi.menu_item_id, mi.name, mi.category
      ORDER BY total_quantity DESC
      LIMIT 10
    `, [targetDate]);

    // Sales by category
    const [categoryBreakdown] = await db.execute(`
      SELECT 
        mi.category,
        COUNT(DISTINCT oi.id) as items_sold,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.subtotal) as total_revenue
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      JOIN orders o ON oi.order_id = o.id
      WHERE DATE(o.created_at) = ? AND o.status IN ('paid', 'completed')
      GROUP BY mi.category
      ORDER BY total_revenue DESC
    `, [targetDate]);

    // Hourly breakdown
    const [hourlyBreakdown] = await db.execute(`
      SELECT 
        HOUR(o.created_at) as hour,
        COUNT(o.id) as orders,
        SUM(o.total_amount) as revenue
      FROM orders o
      WHERE DATE(o.created_at) = ? AND o.status IN ('paid', 'completed')
      GROUP BY HOUR(o.created_at)
      ORDER BY hour
    `, [targetDate]);

    // Payment methods
    const [paymentMethods] = await db.execute(`
      SELECT 
        p.payment_method,
        COUNT(p.id) as transactions,
        SUM(p.amount) as total_amount
      FROM payments p
      JOIN orders o ON p.order_id = o.id
      WHERE DATE(o.created_at) = ?
      GROUP BY p.payment_method
      ORDER BY total_amount DESC
    `, [targetDate]);

    res.json({
      date: targetDate,
      summary: summary[0],
      bestSellingItems: bestSelling,
      categoryBreakdown,
      hourlyBreakdown,
      paymentMethods
    });
  } catch (error) {
    next(error);
  }
};

const getMonthlySales = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const targetMonth = month || (new Date().getMonth() + 1);
    const targetYear = year || new Date().getFullYear();

    const [dailyData] = await db.execute(`
      SELECT 
        DAY(o.created_at) as day,
        COUNT(DISTINCT o.id) as total_orders,
        SUM(o.total_amount) as total_revenue
      FROM orders o
      WHERE MONTH(o.created_at) = ? AND YEAR(o.created_at) = ? 
        AND o.status IN ('paid', 'completed')
      GROUP BY DAY(o.created_at)
      ORDER BY day
    `, [targetMonth, targetYear]);

    const [monthSummary] = await db.execute(`
      SELECT 
        COUNT(DISTINCT o.id) as total_orders,
        SUM(o.total_amount) as total_revenue,
        COUNT(DISTINCT DATE(o.created_at)) as active_days,
        AVG(o.total_amount) as average_order_value
      FROM orders o
      WHERE MONTH(o.created_at) = ? AND YEAR(o.created_at) = ? 
        AND o.status IN ('paid', 'completed')
    `, [targetMonth, targetYear]);

    res.json({
      month: targetMonth,
      year: targetYear,
      summary: monthSummary[0],
      dailyBreakdown: dailyData
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDailySales,
  getMonthlySales
};