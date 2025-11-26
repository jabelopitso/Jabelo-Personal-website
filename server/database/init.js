import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../data/portfolio.db');

class Database {
  constructor() {
    this.db = new sqlite3.Database(dbPath);
    this.run = promisify(this.db.run.bind(this.db));
    this.get = promisify(this.db.get.bind(this.db));
    this.all = promisify(this.db.all.bind(this.db));
  }

  async close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

let db;

export async function initDatabase() {
  db = new Database();

  // Create tables
  await db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      image_url TEXT,
      github_url TEXT,
      demo_url TEXT,
      technologies TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      page_path TEXT,
      user_agent TEXT,
      ip_address TEXT,
      session_id TEXT,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'unread',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT,
      proficiency INTEGER DEFAULT 0,
      years_experience INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert sample data if tables are empty
  const projectCount = await db.get('SELECT COUNT(*) as count FROM projects');
  if (projectCount.count === 0) {
    await insertSampleData();
  }

  return db;
}

async function insertSampleData() {
  const sampleProjects = [
    {
      title: 'Advanced Portfolio Website',
      description: 'Modern portfolio with TypeScript, Express.js, SQLite, and advanced animations',
      category: 'Web Development',
      image_url: '/images/portfolio.jpg',
      github_url: 'https://github.com/jabelopitso/portfolio',
      demo_url: 'https://jabelopitso.com',
      technologies: JSON.stringify(['TypeScript', 'Express.js', 'SQLite', 'Three.js', 'GSAP'])
    },
    {
      title: 'Real-time Chat Application',
      description: 'WebSocket-based chat with encryption and file sharing',
      category: 'Web Development',
      image_url: '/images/chat-app.jpg',
      github_url: 'https://github.com/jabelopitso/chat-app',
      technologies: JSON.stringify(['Node.js', 'Socket.io', 'Redis', 'JWT', 'WebRTC'])
    },
    {
      title: 'Machine Learning Dashboard',
      description: 'Interactive ML model visualization and training interface',
      category: 'AI',
      image_url: '/images/ml-dashboard.jpg',
      github_url: 'https://github.com/jabelopitso/ml-dashboard',
      technologies: JSON.stringify(['Python', 'TensorFlow', 'FastAPI', 'React', 'D3.js'])
    }
  ];

  for (const project of sampleProjects) {
    await db.run(`
      INSERT INTO projects (title, description, category, image_url, github_url, demo_url, technologies)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [project.title, project.description, project.category, project.image_url, 
        project.github_url, project.demo_url, project.technologies]);
  }

  const sampleSkills = [
    { name: 'JavaScript', category: 'Frontend', proficiency: 90, years_experience: 3 },
    { name: 'TypeScript', category: 'Frontend', proficiency: 85, years_experience: 2 },
    { name: 'React', category: 'Frontend', proficiency: 88, years_experience: 2 },
    { name: 'Node.js', category: 'Backend', proficiency: 82, years_experience: 2 },
    { name: 'Python', category: 'Backend', proficiency: 85, years_experience: 3 },
    { name: 'SQL', category: 'Database', proficiency: 80, years_experience: 2 },
    { name: 'Docker', category: 'DevOps', proficiency: 75, years_experience: 1 },
    { name: 'AWS', category: 'Cloud', proficiency: 70, years_experience: 1 }
  ];

  for (const skill of sampleSkills) {
    await db.run(`
      INSERT INTO skills (name, category, proficiency, years_experience)
      VALUES (?, ?, ?, ?)
    `, [skill.name, skill.category, skill.proficiency, skill.years_experience]);
  }
}

export function getDatabase() {
  return db;
}