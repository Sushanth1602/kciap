import React, { useState } from 'react'
import { Bot, Send, HelpCircle } from 'lucide-react'

function AiAssistant({ apiBase, defaultPrompt, rolePromptSuggestions }) {
  const [question, setQuestion] = useState(defaultPrompt || 'Show repeat offenders in Bengaluru')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const samplePrompts = rolePromptSuggestions || [
    "Show burglary trends in Bengaluru.",
    "List high severity cases from last month.",
    "Identify repeat offenders."
  ]

  async function handleAsk(textToSend) {
    const query = typeof textToSend === 'string' ? textToSend : question
    if (!query.trim()) return
    setLoading(true)
    setAnswer('')

    try {
      const response = await fetch(`${apiBase}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query }),
      })
      const data = await response.json()
      setAnswer(data.answer || 'No database summary matching this description is available.')
    } catch (error) {
      setAnswer('Failed to fetch response. Please verify that KCIAP backend services are active.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="p-2.5 bg-govblue/10 rounded-xl text-govblue border border-govblue/20">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-govnavy uppercase tracking-wide">KCIAP AI Intelligence Assistant</h2>
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Natural Language Database querying</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12 items-start">
        {/* Chat / Ask Form */}
        <div className="lg:col-span-8 space-y-4">
          <form onSubmit={(e) => { e.preventDefault(); handleAsk(); }} className="space-y-3">
            <textarea
              rows={3}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask an analytical or strategic question about crime database records..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs md:text-sm text-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-govnavy text-white hover:bg-slate-800 px-5 py-2.5 text-xs font-semibold tracking-wider uppercase transition border-b-4 border-slate-950 flex items-center gap-1.5 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Querying Database...' : 'Execute Query'}
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs md:text-sm text-slate-700">
            <h3 className="mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Response Details</h3>
            <p className="leading-relaxed whitespace-pre-wrap">
              {answer || 'Type your question or click one of the suggested prompts to query the unified database.'}
            </p>
          </div>
        </div>

        {/* Suggestions Panel */}
        <div className="lg:col-span-4 space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <h3 className="text-xs font-bold text-govnavy uppercase tracking-wider flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-govgold" />
            Suggested Queries
          </h3>
          <div className="space-y-2">
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => { setQuestion(prompt); handleAsk(prompt); }}
                className="w-full text-left p-2.5 bg-white border border-slate-250 hover:border-govblue rounded-xl text-[11px] font-bold text-slate-700 hover:text-govblue transition"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AiAssistant
