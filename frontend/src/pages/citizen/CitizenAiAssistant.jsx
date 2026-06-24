import React from 'react'
import AiAssistant from '../../components/ai/AiAssistant'
import { Bot } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function CitizenAiAssistant() {
  return (
    <div className="space-y-6 select-none max-w-4xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-govpurple"></div>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-govpurple/10 rounded-xl text-govpurple border border-govpurple/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-govnavy uppercase tracking-wide">Public AI Safety Advisor</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Automated safety guidance chat interface</p>
          </div>
        </div>
      </div>

      <AiAssistant
        apiBase={API_BASE}
        defaultPrompt="How do I report cyber fraud?"
        rolePromptSuggestions={[
          "How do I report cyber fraud?",
          "How do I track my complaint status?",
          "What should I do if my phone is stolen?",
          "What is KSP emergency safety helpline number?"
        ]}
      />
    </div>
  )
}
