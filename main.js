// Smooth Scroll Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Menu Characters Data
const characters = [
    { name: 'Isagi', desc: 'Mousse con tapioca verde, manzana, purpurina comestible dorada y menta.' },
    { name: 'Bachira', desc: 'Mango sago con papel comestible temático.' },
    { name: 'Rin', desc: 'Coulant de chocolate negro con caramelo turquesa y cereza.' },
    { name: 'Charles', desc: 'Algodón de azúcar de limón/plátano con purpurina.' },
    { name: 'Sae', desc: 'Café a elección con prestigiosos petit fours.' },
    { name: 'Shidou', desc: 'Arroz con leche / leche condensada + cupcake con interior líquido sabor fresa.' },
    { name: 'Chigiri', desc: 'Postre elegante de fresa tipo soufflé o bizcocho.' },
    { name: 'Kunigami', desc: 'Postre caliente con efecto humo y colores lava.' },
    { name: 'Kaiser', desc: 'Postre de queso con coulis de arándano y pétalos azules.' },
    { name: 'Ness', desc: 'Postre con pretzel, helado y purpurina morada.' },
    { name: 'Reo', desc: 'Propuesta creativa con billetes comestibles y oro.' },
    { name: 'Nagi', desc: 'Mochis de nata con cobertura minimalista.' },
    { name: 'Barou', desc: 'Omelette especial con técnica francesa y toque de picante.' }
];

// Re-populate menu grid (example of dynamic generation)
const menuGrid = document.getElementById('menu-grid');
if (menuGrid) {
    // Clear existing for now if we want to build from scratch
    menuGrid.innerHTML = '';
    
    characters.forEach((char, index) => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Use a mix of placeholders and specific generated images
        let imgUrl = `https://images.unsplash.com/photo-1551024601-bec78acc704b?auto=format&fit=crop&q=80&w=400&index=${index}`;
        
        if (char.name === 'Isagi') {
            imgUrl = '/assets/dessert-isagi.png';
        }
        
        card.innerHTML = `
            <img src="${imgUrl}" alt="${char.name}" class="menu-img">
            <div class="menu-content">
                <h4>${char.name}</h4>
                <p>${char.desc}</p>
            </div>
        `;
        menuGrid.appendChild(card);
    });
}

// Simple Intersection Observer for Fade-in effects
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.8s ease-out';
    observer.observe(section);
});
