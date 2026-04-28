const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env file from project root
const envPath = './.env';
const envContent = fs.readFileSync(envPath, 'utf8');

const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : null;
const supabaseAnonKey = keyMatch ? keyMatch[1].trim() : null;

console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? 'Found' : 'Not found');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    const { data, error } = await supabase.from('non_existent_table').select('*').limit(1);
    
    if (error) {
        console.log('--- RESULTADO DEL TEST ---');
        console.log('Código de error:', error.code);
        console.log('Mensaje:', error.message);
        console.log('Detalles:', error.details);
        console.log('---------------------------');
        if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
            console.log('¡CONEXIÓN EXITOSA!');
            console.log('El servidor de Supabase respondió correctamente.');
        } else {
            console.log('Conexión fallida o error inesperado.');
        }
    } else {
        console.log('--- RESULTADO DEL TEST ---');
        console.log('¡CONEXIÓN EXITOSA!');
        console.log('La tabla existe y devolvió datos:', data);
        console.log('---------------------------');
    }
}

test();
