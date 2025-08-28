import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rnberjvkhkyoocczalqb.supabase.co" 
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuYmVyanZraGt5b29jY3phbHFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MzE5MTYsImV4cCI6MjA3MTQwNzkxNn0.2Fit_bwG2crOhJM6z4c92_3Xn8rw3lU97okTu2C8U3I" 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
