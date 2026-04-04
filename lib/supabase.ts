import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Если ключи не подтянулись, мы увидим это в консоли браузера
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Ошибка: Проверьте файл .env.local и перезапустите сервер!");
}

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
)