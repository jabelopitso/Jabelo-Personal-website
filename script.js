// Smooth scroll
document.querySelectorAll('header nav a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});

// Load projects dynamically from JSON
async function loadProjects() {
    const res = await fetch('projects.json');
    const projects = await res.json();

    const grid = document.getElementById('portfolio');
    grid.innerHTML = '';

    projects.forEach(project => {
        const card = document.createElement('div');
        card.classList.add('card', project.category.replace(/\s/g, '')); // remove spaces for class
        card.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <p>${project.title}</p>
        `;
        card.addEventListener('click', () => {
            alert(`${project.title}\n\nCategory: ${project.category}\n\n${project.description}`);
        });
        grid.appendChild(card);
    });
}

// Filter functionality
const buttons = document.querySelectorAll('.filter-btn');
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.dataset.category.replace(/\s/g, '');
        document.querySelectorAll('#portfolio .card').forEach(card => {
            if (category === 'all' || card.classList.contains(category)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Initialize
loadProjects();
