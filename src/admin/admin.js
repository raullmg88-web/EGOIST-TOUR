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
            authError.innerText = "Error: Supabase no está configurado.";
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
                authError.innerText = "Error: Supabase no está configurado.";
                return;
            }

            const emailInput = document.getElementById('email').value.trim();
            const passwordInput = document.getElementById('password').value;

            // Map custom login "kira" to a valid Supabase Auth account
            let authEmail = emailInput;
            let authPassword = passwordInput;

            if (emailInput.toLowerCase() === 'kira' && passwordInput === 'kira') {
                authEmail = 'kira@egoist.tour';
                authPassword = 'kira123456';
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email: authEmail,
                password: authPassword,
            });

            if (error) {
                authError.innerText = error.message === 'Invalid login credentials' && emailInput.toLowerCase() === 'kira' 
                    ? 'Error: Asegúrate de haber creado el usuario kira@egoist.tour con contraseña kira123456 en Supabase.' 
                    : error.message;
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
