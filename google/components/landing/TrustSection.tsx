import React from "react";

export default function TrustSection() {
  return (
    <section className="w-full py-12 border-t border-b border-white/5 bg-[#0B0B0F]/20 flex justify-center">
      <div className="w-full max-w-5xl px-6">
        <p className="text-center text-[10px] font-bold text-zinc-550 uppercase tracking-widest mb-10 select-none">
          Trusted by Developers Worldwide
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center justify-items-center opacity-40 hover:opacity-60 transition-opacity duration-300">
          
          {/* Google */}
          <div className="flex items-center space-x-2 text-zinc-400 font-semibold text-xs select-none">
            <svg className="h-4.5 w-4.5 fill-current text-zinc-400" viewBox="0 0 24 24">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.53 5.53 0 0 1 8.5 13a5.53 5.53 0 0 1 5.49-5.514c2.258 0 4.112 1.34 4.887 3.257l3.887-1.5C21.36 5.314 17.657 3 13.99 3 7.828 3 3 7.828 3 13.99c0 6.162 4.828 10.99 10.99 10.99 7.029 0 11.23-4.937 11.23-11.23 0-.771-.086-1.5-.214-2.465H12.24z" />
            </svg>
            <span className="tracking-tight">Google</span>
          </div>

          {/* GitHub */}
          <div className="flex items-center space-x-2 text-zinc-400 font-semibold text-xs select-none">
            <svg className="h-4.5 w-4.5 fill-current text-zinc-400" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            <span className="tracking-tight">GitHub</span>
          </div>

          {/* Firebase */}
          <div className="flex items-center space-x-2 text-zinc-400 font-semibold text-xs select-none">
            <svg className="h-4.5 w-4.5 fill-current text-zinc-400" viewBox="0 0 24 24">
              <path d="M4.686 16.79L8.41 9.774l-3.32-6.24c-.267-.5-.99-.444-1.173.09L2.02 14.887l2.666 1.904zm14.628.003l-2.072-3.957-1.375-2.623-3.66-6.995c-.276-.528-1.034-.492-1.2.062L8.98 9.55l3.528 6.745c.195.372.673.498.1.233h6.634c.54 0 .846-.61.42-.962l-.348-.273zm.666-1.57l-1.63-3.111-2.92-5.584c-.255-.487-.962-.486-1.217.002L2.096 17.518c-.378.723.146 1.582.956 1.582h14.936c.808 0 1.333-.856.958-1.58l-1.326-2.522z" />
            </svg>
            <span className="tracking-tight">Firebase</span>
          </div>

          {/* Cloud Run */}
          <div className="flex items-center space-x-2 text-zinc-400 font-semibold text-xs select-none">
            <svg className="h-4.5 w-4.5 fill-current text-zinc-400" viewBox="0 0 24 24">
              <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z" />
            </svg>
            <span className="tracking-tight">Cloud Run</span>
          </div>

          {/* Vertex AI */}
          <div className="flex items-center space-x-2 text-zinc-400 font-semibold text-xs select-none">
            <svg className="h-4.5 w-4.5 fill-current text-zinc-400" viewBox="0 0 24 24">
              <path d="M12 2L2 22h20L12 2zm0 4.25L18.75 19H5.25L12 6.25z M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
            </svg>
            <span className="tracking-tight">Vertex AI</span>
          </div>

          {/* Supabase */}
          <div className="flex items-center space-x-2 text-zinc-400 font-semibold text-xs select-none">
            <svg className="h-4.5 w-4.5 fill-current text-zinc-400" viewBox="0 0 24 24">
              <path d="M13.62 1.38a1.2 1.2 0 0 0-1.8 0L3.13 10.07a1.2 1.2 0 0 0 .85 2.05h6.63L8.6 22.62a1.2 1.2 0 0 0 1.8 0l8.69-8.69a1.2 1.2 0 0 0-.85-2.05h-6.63l2.01-10.5z" />
            </svg>
            <span className="tracking-tight">Supabase</span>
          </div>

        </div>
      </div>
    </section>
  );
}
