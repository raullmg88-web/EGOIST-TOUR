import { supabase } from '../supabaseClient.js';
import { loadModule } from './dashboard.js';

document.addEventListener('DOMContentLoaded', async () => {
    const authView = document.getElementById('auth-view');
    const dashboardView = document.getElementById('dashboard-view');
    const loginForm = document.getElementById('login-form');
    const authError = document.getElementById('auth-error');
    const logoutBtn = document.getElementById('logout-btn');
    const userInfo = document.getElementById('user-info');
    
    // Check initial session
    await checkSession();

    // Listen for auth state changes
    if (supabase) {
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                showDashboard(session.user);
            } else if (event === 'SIGNED_OUT') {
                showLogin();
            }
        });
    }

    async function checkSession() {
        if (!supabase) {
            authError.innerText = "Modo Local: Supabase no configurado. Iniciando sesión simulada.";
            setTimeout(() => {
                showDashboard({ email: 'admin@local.test' });
            }, 1000);
            return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            showDashboard(session.user);
        } else {
            showLogin();
        }
    }

    function showDashboard(user) {
        authView.classList.add('hidden');
        dashboardView.classList.remove('hidden');
        userInfo.innerText = user.email;
        
        // Initialize dashboard nav
        initDashboardNav();
    }

    function showLogin() {
        authView.classList.remove('hidden');
        dashboardView.classList.add('hidden');
    }

    // Login Form Submit
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            authError.innerText = '';
            
            if (!supabase) {
                showDashboard({ email: 'admin@local.test' });
                return;
            }

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                authError.innerText = error.message;
            }
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            if (supabase) {
                await supabase.auth.signOut();
            } else {
                showLogin();
            }
        });
    }

    // Dashboard Navigation
    function initDashboardNav() {
        const navButtons = document.querySelectorAll('.nav-item[data-module]');
        
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                navButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const moduleName = e.target.getAttribute('data-module');
                document.getElementById('module-title').innerText = e.target.innerText;
                loadModule(moduleName);
            });
        });

        // Load default module
        loadModule('dashboard');
    }
});
