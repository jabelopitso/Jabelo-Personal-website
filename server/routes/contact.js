import express from 'express';
import { getDatabase } from '../database/init.js';

const router = express.Router();

// POST /api/contact - Submit contact form
router.post('/', async (req, res, next) => {
  try {
    const db = getDatabase();
    const { name, email, subject, message } = req.body;
    
    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Name, email, and message are required' 
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }
    
    // Insert message
    const result = await db.run(`
      INSERT INTO contact_messages (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `, [name, email, subject || 'No subject', message]);
    
    res.json({ 
      success: true, 
      message: 'Message sent successfully',
      id: result.lastID
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/contact/messages - Get all contact messages (admin only)
router.get('/messages', async (req, res, next) => {
  try {
    const db = getDatabase();
    const { status, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM contact_messages WHERE 1=1';
    const params = [];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const messages = await db.all(query, params);
    
    res.json({
      messages,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/contact/messages/:id/status - Update message status
router.put('/messages/:id/status', async (req, res, next) => {
  try {
    const db = getDatabase();
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['unread', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be: unread, read, replied, or archived' 
      });
    }
    
    await db.run(`
      UPDATE contact_messages 
      SET status = ? 
      WHERE id = ?
    `, [status, id]);
    
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;