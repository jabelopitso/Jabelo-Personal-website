import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Simple projects API
app.get('/api/projects', (req, res) => {
  try {
    const projectsPath = path.join(__dirname, '../projects.json');
    const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

// Simple contact API
app.post('/api/contact', (req, res) => {
  console.log('Contact form submission:', req.body);
  res.json({ success: true, message: 'Message received' });
});

// Simple analytics API
app.post('/api/analytics/track', (req, res) => {
  console.log('Analytics event:', req.body);
  res.json({ success: true });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});