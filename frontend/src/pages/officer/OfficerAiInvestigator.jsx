import React from 'react'
import AiAssistant from '../../components/ai/AiAssistant'
import { Bot } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function OfficerAiInvestigator() {
  return (
    <div className="space-y-6 select-none text-slate-350 max-w-4xl mx-auto">
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-govgold"></div>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-govgold/10 rounded-xl text-govgold border border-govgold/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wide">Investigative AI Copilot</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Automated investigation intelligence query panel</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden border border-slate-800">
        <AiAssistant
          apiBase={API_BASE}
          defaultPrompt="Show repeat offenders in Bengaluru"
          rolePromptSuggestions={[
            "Show robbery cases in Bengaluru",
            "Generate investigation summary",
            "Show repeat offenders",
            "Identify weapon profiles in burglary clusters"
          ]}
        />
      </div>
    </div>
  )
}
