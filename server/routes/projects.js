import express from 'express';
import { getDatabase } from '../database/init.js';

const router = express.Router();

// GET /api/projects - Get all projects with filtering and pagination
router.get('/', async (req, res, next) => {
  try {
    const db = getDatabase();
    const { category, limit = 20, offset = 0, search } = req.query;
    
    let query = 'SELECT * FROM projects WHERE 1=1';
    const params = [];
    
    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const projects = await db.all(query, params);
    
    // Parse technologies JSON
    const formattedProjects = projects.map(project => ({
      ...project,
      technologies: project.technologies ? JSON.parse(project.technologies) : []
    }));
    
    res.json({
      projects: formattedProjects,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: projects.length
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:id - Get single project
router.get('/:id', async (req, res, next) => {
  try {
    const db = getDatabase();
    const { id } = req.params;
    
    const project = await db.get('SELECT * FROM projects WHERE id = ?', [id]);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Parse technologies JSON
    project.technologies = project.technologies ? JSON.parse(project.technologies) : [];
    
    res.json(project);
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/categories - Get all project categories
router.get('/meta/categories', async (req, res, next) => {
  try {
    const db = getDatabase();
    
    const categories = await db.all(`
      SELECT category, COUNT(*) as count 
      FROM projects 
      GROUP BY category 
      ORDER BY count DESC
    `);
    
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/stats - Get project statistics
router.get('/meta/stats', async (req, res, next) => {
  try {
    const db = getDatabase();
    
    const totalProjects = await db.get('SELECT COUNT(*) as count FROM projects');
    const categoriesCount = await db.get('SELECT COUNT(DISTINCT category) as count FROM projects');
    const recentProjects = await db.get(`
      SELECT COUNT(*) as count 
      FROM projects 
      WHERE created_at > datetime('now', '-30 days')
    `);
    
    res.json({
      total_projects: totalProjects.count,
      categories: categoriesCount.count,
      recent_projects: recentProjects.count
    });
  } catch (error) {
    next(error);
  }
});

export default router;