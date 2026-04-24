import { supabase } from '../supabaseClient.js';

export async function fetchRecords(tableName) {
    if (!supabase) return [];
    
    const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

    if (error) {
        console.error(`Error fetching from ${tableName}:`, error);
        throw error;
    }
    return data || [];
}

export async function saveRecord(tableName, recordData, id = null) {
    if (!supabase) throw new Error('Supabase no está configurado');

    if (id) {
        // Update
        const { data, error } = await supabase
            .from(tableName)
            .update({ ...recordData, updated_at: new Date() })
            .eq('id', id)
            .select();
            
        if (error) throw error;
        return data[0];
    } else {
        // Insert
        const { data, error } = await supabase
            .from(tableName)
            .insert([recordData])
            .select();
            
        if (error) throw error;
        return data[0];
    }
}

export async function deleteRecord(tableName, id) {
    if (!supabase) throw new Error('Supabase no está configurado');
    
    const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
        
    if (error) throw error;
    return true;
}

export async function uploadImage(file) {
    if (!supabase) throw new Error('Supabase no está configurado');
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('egoist-assets')
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
        .from('egoist-assets')
        .getPublicUrl(filePath);

    return data.publicUrl;
}
