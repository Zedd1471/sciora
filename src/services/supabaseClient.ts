import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wmsgqvclkqwdvofxntgj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indtc2dxdmNsa3F3ZHZvZnhudGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MDI4NjIsImV4cCI6MjA2NTE3ODg2Mn0.LARCxxM3_1X2ivpSoOHa9aMuUj7ciI0ac2D1mivXG0Q";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);