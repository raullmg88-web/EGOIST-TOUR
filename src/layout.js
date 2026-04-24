export function initLayout() {
    const headerHTML = `
    <header id="main-header">
        <div class="logo">
            <a href="/">
                <img src="/assets/logo_brito.png" alt="Brito Fundación" id="header-logo">
            </a>
        </div>
        <nav>
            <ul>
                <li><a href="/">Inicio</a></li>
                <li><a href="/cosplayers/">Cosplayers</a></li>
                <li><a href="/artistas/">Artistas</a></li>
                <li><a href="/invitados/">Invitados</a></li>
                <li><a href="/merch/">Merch</a></li>
                <li><a href="/horarios/">Horarios</a></li>
                <li><a href="/info/">Info</a></li>
            </ul>
        </nav>
        <a href="/#entradas" class="btn btn-primary">Comprar entrada</a>
    </header>
    `;

    const footerHTML = `
    <footer>
        <div class="container">
            <img src="/assets/logo_brito.png" alt="Brito Fundación" style="height: 30px; margin-bottom: 20px;">
            <div class="socials">
                <a href="#">Instagram</a>
                <a href="#">Twitter/X</a>
                <a href="#">TikTok</a>
            </div>
            <div class="footer-bottom">
                <span>&copy; 2026 Blue Lock Fan Event</span>
                <a href="#">Aviso Legal</a>
                <a href="#">Privacidad</a>
                <a href="#">Contacto</a>
            </div>
        </div>
    </footer>
    `;

    // Insert Header at the beginning of the body
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    
    // Insert Footer at the end of the body
    document.body.insertAdjacentHTML('beforeend', footerHTML);

    // Header scroll effect
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Smooth Scroll Navigation for anchor links on the same page
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

    // Easter egg: 5 clicks on logo to open admin login
    const logo = document.getElementById('header-logo');
    if (logo) {
        let clickCount = 0;
        let clickTimer;
        
        logo.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior if wrapping tag is a
            clickCount++;
            
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => {
                // If the user clicks slowly, just act like a normal link to /
                if (clickCount < 5) {
                    window.location.href = '/';
                }
                clickCount = 0;
            }, 1500); // Wait 1.5 seconds before resetting

            if (clickCount === 5) {
                window.location.href = '/admin/';
                clickCount = 0;
            }
        });
    }
}
