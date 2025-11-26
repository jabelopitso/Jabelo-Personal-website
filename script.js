// Simple Portfolio JavaScript
const api = {
  async trackEvent(type, path, data) {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type: type, page_path: path, metadata: data })
      });
    } catch (e) { console.log('Analytics unavailable'); }
  },
  async getProjects() {
    try {
      const res = await fetch('/api/projects');
      return await res.json();
    } catch (e) {
      const res = await fetch('projects.json');
      return await res.json();
    }
  },
  async submitContactForm(data) {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  }
};

class PortfolioApp {
    constructor() {
        this.currentFilter = 'all';
        this.projects = [];
        this.init();
    }

    async init() {
        try {
            await api.trackEvent('page_view', window.location.pathname);
            this.setupNavigation();
            this.setupFilterTabs();
            this.setupModalHandlers();
            this.setupContactForm();
            await this.loadProjects();
            console.log('Portfolio app initialized');
        } catch (error) {
            console.error('Failed to initialize app:', error);
        }
    }

    setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                
                await api.trackEvent('navigation', targetId);
                
                if (targetId === '#about') {
                    this.openModal('about-modal');
                } else if (targetId === '#contact') {
                    this.openModal('contact-modal');
                } else if (targetId === '#projects') {
                    document.querySelector('.masonry-container')?.scrollIntoView({ behavior: 'smooth' });
                } else if (targetId === '#home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    async loadProjects() {
        try {
            const response = await api.getProjects();
            this.projects = response.projects || response;
            this.renderProjects(this.projects);
        } catch (error) {
            console.error('Error loading projects:', error);
            this.createFallbackProjects();
        }
    }

    renderProjects(projects) {
        const grid = document.getElementById('masonry-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        projects.forEach((project, index) => {
            const card = this.createProjectCard(project, index);
            grid.appendChild(card);
        });
    }

    createProjectCard(project, index) {
        const card = document.createElement('div');
        card.classList.add('pinterest-card', project.category.replace(/\s/g, ''));
        
        const heights = [200, 250, 300, 350, 400];
        const randomHeight = heights[Math.floor(Math.random() * heights.length)];
        const imageUrl = project.image_url || project.image || `https://via.placeholder.com/300x${randomHeight}/667eea/ffffff?text=${encodeURIComponent(project.title)}`;
        
        card.innerHTML = `
            <img src="${imageUrl}" 
                 alt="${project.title}" 
                 style="height: ${randomHeight}px; object-fit: cover;"
                 loading="lazy">
            <div class="card-content">
                <h3 class="card-title">${project.title}</h3>
                <p class="card-description">${project.description}</p>
                <span class="card-category">${project.category}</span>
            </div>
            <div class="card-overlay">
                <button class="overlay-btn">View Details</button>
            </div>
        `;
        
        card.addEventListener('click', () => this.showProjectDetails(project));
        return card;
    }

    showProjectDetails(project) {
        alert(`${project.title}\n\nCategory: ${project.category}\n\n${project.description}`);
    }

    setupFilterTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                this.filterProjects(category);
            });
        });
    }

    filterProjects(category) {
        const cards = document.querySelectorAll('.pinterest-card');
        cards.forEach(card => {
            const shouldShow = category === 'all' || card.classList.contains(category.replace(/\s/g, ''));
            card.style.display = shouldShow ? 'block' : 'none';
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    setupModalHandlers() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close')) {
                const modal = e.target.closest('.modal');
                if (modal) modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    setupContactForm() {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: e.target.querySelector('input[type="text"]').value,
                email: e.target.querySelector('input[type="email"]').value,
                message: e.target.querySelector('textarea').value
            };
            
            try {
                await api.submitContactForm(formData);
                alert(`Thank you ${formData.name}! Your message has been sent.`);
                e.target.reset();
                this.closeModal('contact-modal');
            } catch (error) {
                alert('Failed to send message. Please try again.');
            }
        });
    }

    createFallbackProjects() {
        const fallbackProjects = [
            {
                title: "E-Commerce Platform",
                description: "A modern e-commerce solution built with React and Node.js",
                category: "Web Development",
                image: "https://via.placeholder.com/300x200/3498db/ffffff?text=E-Commerce"
            },
            {
                title: "Brand Identity Design",
                description: "Complete brand identity package for a tech startup",
                category: "Design",
                image: "https://via.placeholder.com/300x300/e74c3c/ffffff?text=Brand+Design"
            },
            {
                title: "AI Chatbot",
                description: "Intelligent chatbot using natural language processing",
                category: "AI",
                image: "https://via.placeholder.com/300x250/9b59b6/ffffff?text=AI+Chatbot"
            }
        ];

        this.renderProjects(fallbackProjects);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});