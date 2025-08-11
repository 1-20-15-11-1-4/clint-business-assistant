import { createClient } from '@supabase/supabase-js'

const supabaseUrl = https://zjytyosnyqctbgrukorx.supabase.co
const supabaseKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqeXR5b3NueXFjdGJncnVrb3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NzExMTYsImV4cCI6MjA3MDQ0NzExNn0.pKNHmyS23TFuqvbwkLZIClsIZ1RX5nRrAPB-SrvNuJs

export const supabase = createClient(supabaseUrl, supabaseKey)
