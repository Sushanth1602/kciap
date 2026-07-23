import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zlfiikupyoqihphvoyzx.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_oI4K6wqCfPKc9XASTu6l_w_VWPM1IYh";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
