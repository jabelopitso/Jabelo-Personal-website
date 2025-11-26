// Pinterest-style Personal Profile JavaScript

// Smooth scroll for navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href');

        // Handle modal opening for about and contact
        if (targetId === '#about') {
            openModal('about-modal');
        } else if (targetId === '#contact') {
            openModal('contact-modal');
        } else if (targetId === '#projects') {
            document.querySelector('.masonry-container').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else if (targetId === '#home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(navLink => {
            navLink.classList.remove('active');
        });
        link.classList.add('active');
    });
});

// Load projects dynamically from JSON with Pinterest-style cards
async function loadProjects() {
    try {
        const res = await fetch('projects.json');
        const projects = await res.json();

        const grid = document.getElementById('masonry-grid');
        grid.innerHTML = '';

        projects.forEach((project, index) => {
            const card = document.createElement('div');
            card.classList.add('pinterest-card', project.category.replace(/\s/g, ''));

            // Generate random heights for Pinterest effect
            const heights = [200, 250, 300, 350, 400];
            const randomHeight = heights[Math.floor(Math.random() * heights.length)];

            card.innerHTML = `
                <img src="${project.image}" alt="${project.title}" style="height: ${randomHeight}px; object-fit: cover;">
                <div class="card-content">
                    <h3 class="card-title">${project.title}</h3>
                    <p class="card-description">${project.description}</p>
                    <span class="card-category">${project.category}</span>
                </div>
                <div class="card-overlay">
                    <button class="overlay-btn">View Details</button>
                </div>
            `;

            card.addEventListener('click', () => {
                showProjectDetails(project);
            });

            grid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
        // Fallback content
        createFallbackProjects();
    }
}

// Load images from the /images/ folder by parsing the directory listing
async function loadImagesFromFolder() {
    try {
        const res = await fetch('/images/');
        if (!res.ok) throw new Error('Failed to fetch /images/ directory');
        const text = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        // The simple Python directory index lists files as <a href="filename">filename</a>
        const anchors = Array.from(doc.querySelectorAll('a'));
        const imageFiles = anchors
            .map(a => a.getAttribute('href'))
            .filter(h => h && h.match(/\.(jpe?g|png|gif|svg)$/i));

        const gallery = document.getElementById('image-gallery');
        if (!gallery) return;
        gallery.innerHTML = '';

        if (imageFiles.length === 0) {
            gallery.innerHTML = '<p class="muted">No images found in /images/</p>';
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'gallery-grid';

        imageFiles.forEach(file => {
            const wrapper = document.createElement('div');
            wrapper.className = 'gallery-item';

            const img = document.createElement('img');
            img.src = '/images/' + file;
            img.alt = file;
            img.loading = 'lazy';
            wrapper.appendChild(img);

            grid.appendChild(wrapper);
        });

        gallery.appendChild(grid);
    } catch (err) {
        console.error('Error loading images from folder:', err);
        const gallery = document.getElementById('image-gallery');
        if (gallery) gallery.innerHTML = '<p class="muted">Error loading images.</p>';
    }
}

// Create fallback projects if JSON fails to load
function createFallbackProjects() {
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
        },
        {
            title: "Portfolio Website",
            description: "Responsive portfolio website with modern animations",
            category: "Web Development",
            image: "https://via.placeholder.com/300x350/2ecc71/ffffff?text=Portfolio"
        },
        {
            title: "Mobile App UI",
            description: "Clean and intuitive mobile app interface design",
            category: "Design",
            image: "https://via.placeholder.com/300x280/f39c12/ffffff?text=Mobile+UI"
        },
        {
            title: "Data Analytics Tool",
            description: "Python-based tool for data visualization and analysis",
            category: "AI",
            image: "https://via.placeholder.com/300x320/34495e/ffffff?text=Analytics"
        }
    ];

    const grid = document.getElementById('masonry-grid');
    grid.innerHTML = '';

    fallbackProjects.forEach((project, index) => {
        const card = document.createElement('div');
        card.classList.add('pinterest-card', project.category.replace(/\s/g, ''));

        const heights = [200, 250, 300, 350, 400];
        const randomHeight = heights[Math.floor(Math.random() * heights.length)];

        card.innerHTML = `
            <img src="${project.image}" alt="${project.title}" style="height: ${randomHeight}px; object-fit: cover;">
            <div class="card-content">
                <h3 class="card-title">${project.title}</h3>
                <p class="card-description">${project.description}</p>
                <span class="card-category">${project.category}</span>
            </div>
            <div class="card-overlay">
                <button class="overlay-btn">View Details</button>
            </div>
        `;

        card.addEventListener('click', () => {
            showProjectDetails(project);
        });

        grid.appendChild(card);
    });
}

// Show project details in a modal-like alert (can be enhanced with a proper modal)
function showProjectDetails(project) {
    alert(`${project.title}\n\nCategory: ${project.category}\n\n${project.description}\n\nClick OK to close.`);
}

// Filter functionality for tabs
const tabButtons = document.querySelectorAll('.tab-btn');
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.dataset.category;

        // Update active tab
        tabButtons.forEach(tabBtn => {
            tabBtn.classList.remove('active');
        });
        btn.classList.add('active');

        // Filter cards
        const cards = document.querySelectorAll('.pinterest-card');
        cards.forEach(card => {
            if (category === 'all' || card.classList.contains(category.replace(/\s/g, ''))) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Modal functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking the X button
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
});

// Close modal when clicking outside of it
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Contact form submission
document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = e.target.querySelector('input[type="text"]').value;
    const email = e.target.querySelector('input[type="email"]').value;
    const message = e.target.querySelector('textarea').value;

    // Here you would typically send the data to a server
    alert(`Thank you ${name}! Your message has been sent. I'll get back to you at ${email} soon.`);

    // Reset form
    e.target.reset();
    closeModal('contact-modal');
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    loadImagesFromFolder();

    // Add some scroll effects
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.pinterest-header');
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
        } else {
            header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        }
    });
});
