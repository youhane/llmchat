
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "No Supabase URL"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "No Supabase Key"
const supabase = createClient(supabaseUrl, supabaseKey)

export { supabase }