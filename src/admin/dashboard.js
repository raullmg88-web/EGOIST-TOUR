import { supabase } from '../supabaseClient.js';
import { fetchRecords, saveRecord, deleteRecord, uploadImage } from './api.js';
import { showToast, openModal } from './ui.js';

const moduleContent = document.getElementById('module-content');
let currentModule = '';

export async function loadModule(moduleName) {
    if (!moduleContent) return;
    currentModule = moduleName;

    moduleContent.innerHTML = '<p style="color: var(--text-muted);">Cargando módulo...</p>';

    switch (moduleName) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'cosplayers':
        case 'artistas':
        case 'invitados':
        case 'merch':
            await renderGenericTable(moduleName);
            break;
        case 'horarios':
            moduleContent.innerHTML = '<p>Módulo de horarios en construcción.</p>';
            break;
        case 'home':
            moduleContent.innerHTML = '<p>Módulo de edición de Home en construcción.</p>';
            break;
        default:
            moduleContent.innerHTML = '<p>Módulo no encontrado.</p>';
    }
}

function renderDashboard() {
    moduleContent.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
            <div class="auth-box" style="padding: 20px;">
                <h3 style="color: var(--accent-cyan);">Base de Datos</h3>
                <p style="margin-top: 10px; color: var(--text-muted);">Estado: <span class="badge success">Conectado</span></p>
            </div>
            <div class="auth-box" style="padding: 20px;">
                <h3 style="color: var(--accent-blue);">Almacenamiento</h3>
                <p style="margin-top: 10px; color: var(--text-muted);">Bucket: egoist-assets</p>
            </div>
        </div>
        <p style="margin-top: 40px; color: var(--text-muted);">Selecciona un módulo en el menú lateral para gestionar el contenido de la web pública.</p>
    `;
}

async function renderGenericTable(tableName) {
    let data = [];
    
    try {
        data = await fetchRecords(tableName);
    } catch (e) {
        moduleContent.innerHTML = `<p class="error-msg">Error al cargar datos: ${e.message}</p>`;
        return;
    }

    const html = `
        <div class="module-header">
            <h2>Gestión de ${tableName.charAt(0).toUpperCase() + tableName.slice(1)}</h2>
            <button id="btn-add-new" class="btn btn-primary">+ Añadir Nuevo</button>
        </div>
        <div style="background: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden;">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Estado</th>
                        <th>Orden</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.length === 0 ? '<tr><td colspan="5" style="text-align:center;">No hay registros.</td></tr>' : ''}
                    ${data.map(row => `
                        <tr>
                            <td style="width: 80px;">
                                ${row.image_url 
                                    ? `<img src="${row.image_url}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">` 
                                    : '<div style="width: 50px; height: 50px; background: var(--bg-dark); border-radius: 4px;"></div>'}
                            </td>
                            <td><strong>${row.name}</strong></td>
                            <td>
                                ${row.is_visible 
                                    ? '<span class="badge success">Público</span>' 
                                    : '<span class="badge danger">Oculto</span>'}
                            </td>
                            <td>${row.sort_order || 0}</td>
                            <td>
                                <button class="btn btn-outline btn-edit" data-id="${row.id}" style="padding: 5px 10px; font-size: 0.8rem;">Editar</button>
                                <button class="btn btn-outline btn-delete" data-id="${row.id}" style="padding: 5px 10px; font-size: 0.8rem; border-color: var(--error); color: var(--error); margin-left: 5px;">Borrar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    moduleContent.innerHTML = html;

    // Attach Event Listeners
    document.getElementById('btn-add-new').addEventListener('click', () => openFormModal(tableName));
    
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const record = data.find(r => r.id === id);
            openFormModal(tableName, record);
        });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if(confirm('¿Estás seguro de que deseas borrar este registro?')) {
                const id = e.target.getAttribute('data-id');
                try {
                    await deleteRecord(tableName, id);
                    showToast('Registro borrado exitosamente');
                    loadModule(tableName); // Reload table
                } catch(error) {
                    showToast('Error al borrar: ' + error.message, 'error');
                }
            }
        });
    });
}

function openFormModal(tableName, record = null) {
    const isEdit = !!record;
    const title = isEdit ? `Editar Registro` : `Añadir Nuevo Registro`;

    // Dynamic fields based on table
    let extraFields = '';
    if (tableName === 'cosplayers') {
        extraFields = `<div class="form-group"><label>Personaje / Temática</label><input type="text" id="f-theme" value="${record?.theme || ''}"></div>`;
    } else if (tableName === 'artistas') {
        extraFields = `<div class="form-group"><label>Especialidad</label><input type="text" id="f-specialty" value="${record?.specialty || ''}"></div>`;
    } else if (tableName === 'invitados') {
        extraFields = `<div class="form-group"><label>Rol</label><input type="text" id="f-role" value="${record?.role || ''}"></div>`;
    } else if (tableName === 'merch') {
        extraFields = `
            <div class="form-row">
                <div class="form-group"><label>Precio</label><input type="text" id="f-price" required value="${record?.price || ''}"></div>
                <div class="form-group"><label>Categoría</label><input type="text" id="f-category" value="${record?.category || ''}"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Etiqueta (Ej: Nuevo, Agotado)</label><input type="text" id="f-label" value="${record?.label || ''}"></div>
                <div class="form-group"><label>En Stock</label>
                    <select id="f-in_stock">
                        <option value="true" ${record?.in_stock !== false ? 'selected' : ''}>Sí</option>
                        <option value="false" ${record?.in_stock === false ? 'selected' : ''}>No (Agotado)</option>
                    </select>
                </div>
            </div>
        `;
    }

    const html = `
        <form id="admin-form">
            <div class="form-group">
                <label>Nombre / Título *</label>
                <input type="text" id="f-name" required value="${record?.name || ''}">
            </div>
            
            ${extraFields}

            <div class="form-group">
                <label>Descripción Corta</label>
                <input type="text" id="f-short_description" value="${record?.short_description || ''}">
            </div>
            
            <div class="form-group">
                <label>Descripción Larga (Opcional)</label>
                <textarea id="f-long_description">${record?.long_description || ''}</textarea>
            </div>

            <div class="form-group">
                <label>Imagen</label>
                <input type="file" id="f-image" accept="image/*">
                ${record?.image_url ? `<img src="${record.image_url}" class="img-preview" id="f-image-preview">` : '<img src="" class="img-preview hidden" id="f-image-preview">'}
            </div>

            <div style="margin: 20px 0; border-top: 1px solid var(--border-color); padding-top: 20px;">
                <h4 style="margin-bottom: 15px; color: var(--accent-blue);">Redes Sociales</h4>
                <div class="form-row">
                    <div class="form-group"><label>Instagram URL</label><input type="url" id="s-instagram" value="${record?.socials?.instagram || ''}"></div>
                    <div class="form-group"><label>Twitter/X URL</label><input type="url" id="s-twitter" value="${record?.socials?.twitter || ''}"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>TikTok URL</label><input type="url" id="s-tiktok" value="${record?.socials?.tiktok || ''}"></div>
                    <div class="form-group"><label>Web URL</label><input type="url" id="s-web" value="${record?.socials?.web || ''}"></div>
                </div>
            </div>

            <div class="form-row" style="margin-top: 20px; border-top: 1px solid var(--border-color); padding-top: 20px;">
                <div class="form-group">
                    <label>Visibilidad</label>
                    <select id="f-is_visible">
                        <option value="true" ${record?.is_visible !== false ? 'selected' : ''}>Público</option>
                        <option value="false" ${record?.is_visible === false ? 'selected' : ''}>Oculto</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Orden (0 primero)</label>
                    <input type="number" id="f-sort_order" value="${record?.sort_order || 0}">
                </div>
                <div class="form-group">
                    <label>Destacado</label>
                    <select id="f-is_featured">
                        <option value="false" ${record?.is_featured !== true ? 'selected' : ''}>No</option>
                        <option value="true" ${record?.is_featured === true ? 'selected' : ''}>Sí</option>
                    </select>
                </div>
            </div>
        </form>
    `;

    openModal(title, html, async () => {
        // Collect data
        let imageUrl = record?.image_url || null;
        const fileInput = document.getElementById('f-image');
        
        if (fileInput.files.length > 0) {
            imageUrl = await uploadImage(fileInput.files[0]);
        }

        const dataToSave = {
            name: document.getElementById('f-name').value,
            short_description: document.getElementById('f-short_description').value,
            long_description: document.getElementById('f-long_description').value,
            image_url: imageUrl,
            is_visible: document.getElementById('f-is_visible').value === 'true',
            is_featured: document.getElementById('f-is_featured').value === 'true',
            sort_order: parseInt(document.getElementById('f-sort_order').value) || 0,
            socials: {
                instagram: document.getElementById('s-instagram')?.value || '',
                twitter: document.getElementById('s-twitter')?.value || '',
                tiktok: document.getElementById('s-tiktok')?.value || '',
                web: document.getElementById('s-web')?.value || '',
            }
        };

        if (tableName === 'cosplayers') dataToSave.theme = document.getElementById('f-theme').value;
        if (tableName === 'artistas') dataToSave.specialty = document.getElementById('f-specialty').value;
        if (tableName === 'invitados') dataToSave.role = document.getElementById('f-role').value;
        if (tableName === 'merch') {
            dataToSave.price = document.getElementById('f-price').value;
            dataToSave.category = document.getElementById('f-category').value;
            dataToSave.label = document.getElementById('f-label').value;
            dataToSave.in_stock = document.getElementById('f-in_stock').value === 'true';
        }

        await saveRecord(tableName, dataToSave, isEdit ? record.id : null);
        loadModule(tableName); // Reload table
    });

    // Image preview listener
    document.getElementById('f-image').addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('f-image-preview');
                preview.src = e.target.result;
                preview.classList.remove('hidden');
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    });
}
