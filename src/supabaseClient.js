import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hjrlwlnordxuzrvlqeix.supabase.co'
const supabaseAnonKey = 'sb_publishable_KfNJ-_9jp0_qG276Jg_JtA_qsy52PtB'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)