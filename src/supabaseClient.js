import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Inicializar cliente solo si existen las variables para evitar errores en entorno de desarrollo local sin configurar
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (!supabase) {
  console.warn('Supabase no está configurado. Por favor, añade VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY a tu archivo .env');
}
