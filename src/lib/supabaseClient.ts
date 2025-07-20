// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nadvttfktpqhjsnwoekr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hZHZ0dGZrdHBxaGpzbndvZWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NzM5MDIsImV4cCI6MjA2MzA0OTkwMn0.O2USAU4QBgRxlKOVFOySGFC3qWE6jSqhZ5pWND0XM9o'

export const supabase = createClient(supabaseUrl, supabaseKey)
