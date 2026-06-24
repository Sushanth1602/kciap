import React from 'react'
import AiAssistant from '../../components/ai/AiAssistant'
import { Bot } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function GovernmentAiStrategicAdvisor() {
  return (
    <div className="space-y-6 select-none max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-govblue"></div>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-govblue/10 rounded-xl text-govblue border border-govblue/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-govnavy uppercase tracking-wide">Strategic Planning AI Copilot</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Strategic planning advisor for resource budgeting audits</p>
          </div>
        </div>
      </div>

      <AiAssistant
        apiBase={API_BASE}
        defaultPrompt="Which districts need more officers?"
        rolePromptSuggestions={[
          "Which districts need more officers?",
          "Generate state monthly crime summary report.",
          "Suggest optimal resource patrol frequencies."
        ]}
      />
    </div>
  )
}
