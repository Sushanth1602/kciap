import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zlfiikupyoqihphvoyzx.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_oI4K6wqCfPKc9XASTu6l_w_VWPM1IYh";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Protect routes starting with /dashboard, /workspace, /projects (not matching /api)
  const isProtected = (path.startsWith("/dashboard") || 
                      path.startsWith("/workspace") || 
                      path.startsWith("/projects")) &&
                      !path.startsWith("/api");

  if (isProtected) {
    const token = request.cookies.get("sb-access-token")?.value;
    
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    
    // Verify token validity with Supabase
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false }
      });
      const { data: { user } } = await supabase.auth.getUser(token);
      
      if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
    } catch {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/workspace/:path*",
    "/projects/:path*"
  ]
};
