import express from 'express';
import { getDatabase } from '../database/init.js';

const router = express.Router();

// POST /api/analytics/track - Track user events
router.post('/track', async (req, res, next) => {
  try {
    const db = getDatabase();
    const { event_type, page_path, metadata } = req.body;
    const user_agent = req.get('User-Agent');
    const ip_address = req.ip;
    const session_id = req.get('X-Session-ID') || 'anonymous';
    
    await db.run(`
      INSERT INTO analytics (event_type, page_path, user_agent, ip_address, session_id, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [event_type, page_path, user_agent, ip_address, session_id, JSON.stringify(metadata || {})]);
    
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// GET /api/analytics/dashboard - Get analytics dashboard data
router.get('/dashboard', async (req, res, next) => {
  try {
    const db = getDatabase();
    const { days = 30 } = req.query;
    
    // Page views by day
    const pageViews = await db.all(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as views
      FROM analytics 
      WHERE event_type = 'page_view' 
        AND created_at > datetime('now', '-${days} days')
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);
    
    // Most viewed pages
    const topPages = await db.all(`
      SELECT 
        page_path,
        COUNT(*) as views
      FROM analytics 
      WHERE event_type = 'page_view'
        AND created_at > datetime('now', '-${days} days')
      GROUP BY page_path
      ORDER BY views DESC
      LIMIT 10
    `);
    
    // Event types distribution
    const eventTypes = await db.all(`
      SELECT 
        event_type,
        COUNT(*) as count
      FROM analytics 
      WHERE created_at > datetime('now', '-${days} days')
      GROUP BY event_type
      ORDER BY count DESC
    `);
    
    // Unique visitors (approximation based on session_id)
    const uniqueVisitors = await db.get(`
      SELECT COUNT(DISTINCT session_id) as count
      FROM analytics 
      WHERE created_at > datetime('now', '-${days} days')
    `);
    
    res.json({
      page_views: pageViews,
      top_pages: topPages,
      event_types: eventTypes,
      unique_visitors: uniqueVisitors.count,
      period_days: parseInt(days)
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/analytics/performance - Get performance metrics
router.get('/performance', async (req, res, next) => {
  try {
    const db = getDatabase();
    
    const performanceMetrics = await db.all(`
      SELECT 
        JSON_EXTRACT(metadata, '$.loadTime') as load_time,
        JSON_EXTRACT(metadata, '$.pageSize') as page_size,
        page_path,
        created_at
      FROM analytics 
      WHERE event_type = 'performance'
        AND JSON_EXTRACT(metadata, '$.loadTime') IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 100
    `);
    
    // Calculate averages
    const avgLoadTime = performanceMetrics.reduce((sum, metric) => 
      sum + parseFloat(metric.load_time || 0), 0) / performanceMetrics.length;
    
    res.json({
      metrics: performanceMetrics,
      averages: {
        load_time: avgLoadTime.toFixed(2)
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;