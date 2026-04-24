export function renderCard(data, type = 'default') {
    let accentClass = 'highlight-blue';
    if (type === 'artistas') accentClass = 'highlight-cyan';
    if (type === 'invitados') accentClass = 'highlight-green';
    if (type === 'merch') accentClass = 'highlight-blue';

    let extraContent = '';
    
    // Fallback images if not present
    const imageUrl = data.image_url || 'https://via.placeholder.com/400x450?text=Egoist+Tour';

    if (type === 'merch') {
        const inStock = data.in_stock !== false;
        extraContent = `
            <p style="color: #fff; font-weight: 800; font-size: 1.2rem;">${data.price || ''}</p>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Categoría: ${data.category || 'N/A'}</p>
            ${data.label ? `<span style="display: inline-block; margin-top: 10px; margin-right: 5px; padding: 4px 8px; background: rgba(0, 136, 255, 0.2); color: var(--accent-blue); border-radius: 4px; font-size: 0.8rem; border: 1px solid var(--accent-blue);">${data.label}</span>` : ''}
            ${inStock ? '<span style="display: inline-block; margin-top: 10px; padding: 4px 8px; background: rgba(57, 255, 20, 0.2); color: var(--accent-green); border-radius: 4px; font-size: 0.8rem; border: 1px solid var(--accent-green);">Disponible</span>' : '<span style="display: inline-block; margin-top: 10px; padding: 4px 8px; background: rgba(255, 0, 0, 0.2); color: #ff4444; border-radius: 4px; font-size: 0.8rem; border: 1px solid #ff4444;">Agotado</span>'}
        `;
    } else {
        // Determine subtitle dynamically based on type
        let subtitle = '';
        if (type === 'cosplayers') subtitle = data.theme || data.subtitle || '';
        if (type === 'artistas') subtitle = data.specialty || data.subtitle || '';
        if (type === 'invitados') subtitle = data.role || data.subtitle || '';

        // Handle socials object
        let socialsHtml = '';
        if (data.socials && typeof data.socials === 'object') {
            ['instagram', 'twitter', 'tiktok', 'web'].forEach(platform => {
                if (data.socials[platform]) {
                    socialsHtml += `
                        <a href="${data.socials[platform]}" target="_blank" style="color: #fff; transition: 0.3s; opacity: 0.7;" onmouseover="this.style.opacity=1; this.style.color='var(--${accentClass.split('-')[1]})'" onmouseout="this.style.opacity=0.7; this.style.color='#fff'">
                            ${getSocialIcon(platform)}
                        </a>
                    `;
                }
            });
        }

        extraContent = `
            <p style="color: #fff; font-weight: 800;">${subtitle}</p>
            <div style="width: 40px; height: 2px; background: var(--${accentClass.split('-')[1]}); margin: 10px 0;"></div>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 15px; flex: 1;">${data.short_description || data.description || ''}</p>
            <div style="display: flex; gap: 15px; margin-top: auto;">
                ${socialsHtml}
            </div>
        `;
    }

    return `
        <div class="cosplayer-card slanted-card squishy-hover reveal-item" style="display: flex; flex-direction: column;">
            <img src="${imageUrl}" alt="${data.name}" class="cosplayer-img" ${type === 'merch' ? 'style="filter: grayscale(0); height: 350px;"' : ''}>
            <div class="cosplayer-info" style="position: relative; background: var(--bg-card); flex: 1; display: flex; flex-direction: column;">
                <h2 class="${accentClass}">${data.name}</h2>
                ${extraContent}
            </div>
        </div>
    `;
}

function getSocialIcon(platform) {
    switch (platform.toLowerCase()) {
        case 'instagram':
            return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>';
        case 'twitter':
        case 'x':
            return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>';
        case 'tiktok':
            return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>';
        default:
            return '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
    }
}
