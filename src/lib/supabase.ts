import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ktsizckvfzjzqnuuqzta.supabase.co'
const supabaseKey = 'sb_publishable_MsE5_WHQTBdPW3qYA5RtCw_40QCT-oY'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'kinetic-ui-auth',
  }
})
