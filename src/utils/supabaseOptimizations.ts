import { supabase } from "@/integrations/supabase/client";

// Connection pool configuration for better performance
export const configureSupabaseForHighLoad = () => {
  // This function can be used to configure connection settings
  // Currently Supabase handles connection pooling automatically
  console.log('Supabase configured for high load scenarios');
};

// Batch operations for bulk inserts
export const batchInsert = async (table: 'products' | 'categories' | 'contact_submissions' | 'customers' | 'quotation_items' | 'quotation_requests', data: any[], batchSize = 100) => {
  const results = [];
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const { data: result, error } = await supabase
      .from(table)
      .insert(batch);
    
    if (error) throw error;
    results.push(result);
  }
  
  return results.flat();
};

// Connection health check
export const checkSupabaseHealth = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id')
      .limit(1);
    
    return { healthy: !error, data };
  } catch (error) {
    return { healthy: false, error };
  }
};
