import { initLayout } from './layout.js';
import { renderCard } from './components.js';
import { cosplayersData, artistasData, invitadosData, merchData } from './data.js';

import { supabase } from './supabaseClient.js';

// Init layout (Header and Footer)
initLayout();

// Determine which page we are on and render the grid
document.addEventListener('DOMContentLoaded', async () => {
    const gridContainer = document.getElementById('content-grid');
    if (!gridContainer) return;

    const pageType = gridContainer.dataset.type;
    let data = [];

    // Fetch from Supabase
    if (supabase) {
        const { data: dbData, error } = await supabase
            .from(pageType)
            .select('*')
            .eq('is_visible', true)
            .order('sort_order', { ascending: true });
            
        if (error) {
            console.error('Error fetching data:', error);
            gridContainer.innerHTML = '<p style="color: var(--error); text-align: center; width: 100%;">Error de conexión. Inténtalo más tarde.</p>';
            return;
        }

        if (dbData && dbData.length > 0) {
            data = dbData;
        }
    }

    if (data.length === 0) {
        gridContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center; width: 100%; grid-column: 1 / -1; padding: 40px 0;">No hay contenido disponible por el momento. ¡Vuelve pronto!</p>';
        return;
    }

    if (pageType === 'horarios') {
        // Group by day
        const grouped = data.reduce((acc, curr) => {
            if (!acc[curr.day]) acc[curr.day] = [];
            acc[curr.day].push(curr);
            return acc;
        }, {});

        Object.keys(grouped).forEach((day, index) => {
            const dayEvents = grouped[day];
            let eventsHtml = dayEvents.map(ev => `
                <div class="pass" style="margin-bottom: 10px;">
                    <span class="highlight-cyan">${ev.title}</span>
                    <span class="time">${ev.start_time} ${ev.end_time ? '– ' + ev.end_time : ''}</span>
                    ${ev.location ? `<br><small style="color: var(--text-muted);"><svg style="width: 12px; vertical-align: middle; margin-right: 4px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>${ev.location}</small>` : ''}
                    ${ev.description ? `<p style="font-size: 0.9rem; margin-top: 5px;">${ev.description}</p>` : ''}
                </div>
            `).join('');

            const cardHTML = `
                <div class="day-card reveal-item delay-${(index % 5) + 1}">
                    <h3>${day}</h3>
                    ${eventsHtml}
                </div>
            `;
            gridContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    } else {
        data.forEach((item, index) => {
            const cardHTML = renderCard(item, pageType);
            const delayClass = `delay-${(index % 5) + 1}`;
            const finalCardHTML = cardHTML.replace('reveal-item', `reveal-item ${delayClass}`);
            
            gridContainer.insertAdjacentHTML('beforeend', finalCardHTML);
        });
    }

    // Re-run observer for new elements
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(item);
    });
});
