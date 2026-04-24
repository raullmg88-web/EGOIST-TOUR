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

    // Try fetching from Supabase first
    if (supabase) {
        const { data: dbData, error } = await supabase
            .from(pageType)
            .select('*')
            .eq('is_visible', true)
            .order('sort_order', { ascending: true });
            
        if (!error && dbData && dbData.length > 0) {
            data = dbData;
        }
    }
    
    // Fallback to local static data if Supabase fails or is empty
    if (data.length === 0) {
        if (pageType === 'cosplayers') data = cosplayersData;
        if (pageType === 'artistas') data = artistasData;
        if (pageType === 'invitados') data = invitadosData;
        if (pageType === 'merch') data = merchData;
    }

    data.forEach((item, index) => {
        // Add artificial delay for entrance animation
        const cardHTML = renderCard(item, pageType);
        // We use a small hack to replace the class with a delayed one based on index
        const delayClass = `delay-${(index % 5) + 1}`;
        const finalCardHTML = cardHTML.replace('reveal-item', `reveal-item ${delayClass}`);
        
        gridContainer.insertAdjacentHTML('beforeend', finalCardHTML);
    });

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
