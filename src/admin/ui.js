export function showToast(message, type = 'success') {
    const existingToast = document.getElementById('admin-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.id = 'admin-toast';
    toast.className = `toast toast-${type}`;
    toast.innerText = message;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

export function openModal(title, contentHTML, onSaveCallback) {
    const modalHTML = `
        <div id="admin-modal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button id="modal-close" class="btn-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${contentHTML}
                </div>
                <div class="modal-footer">
                    <button id="modal-cancel" class="btn btn-outline">Cancelar</button>
                    <button id="modal-save" class="btn btn-primary">Guardar Cambios</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('admin-modal');
    const closeBtn = document.getElementById('modal-close');
    const cancelBtn = document.getElementById('modal-cancel');
    const saveBtn = document.getElementById('modal-save');

    const closeModal = () => modal.remove();

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Handle Save with loading state
    saveBtn.addEventListener('click', async () => {
        saveBtn.disabled = true;
        saveBtn.innerText = 'Guardando...';
        try {
            await onSaveCallback();
            closeModal();
            showToast('Guardado correctamente');
        } catch (error) {
            console.error(error);
            showToast(error.message || 'Error al guardar', 'error');
            saveBtn.disabled = false;
            saveBtn.innerText = 'Guardar Cambios';
        }
    });
}
