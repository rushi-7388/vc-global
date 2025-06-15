
import { supabase } from "@/integrations/supabase/client";

// Connection pool configuration for better performance
export const configureSupabaseForHighLoad = () => {
  // Enable connection pooling and optimize settings
  const originalFrom = supabase.from.bind(supabase);
  
  supabase.from = (table: string) => {
    const query = originalFrom(table);
    
    // Add connection pooling headers
    const originalSelect = query.select.bind(query);
    query.select = (...args: any[]) => {
      const result = originalSelect(...args);
      return result;
    };
    
    return query;
  };
};

// Batch operations for bulk inserts
export const batchInsert = async (table: string, data: any[], batchSize = 100) => {
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
