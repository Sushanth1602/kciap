import { useState } from 'react'

function AiAssistant({ apiBase }) {
  const [question, setQuestion] = useState('Show me repeat offenders in Bengaluru')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAsk(event) {
    event.preventDefault()
    if (!question.trim()) return
    setLoading(true)
    setAnswer('')

    try {
      const response = await fetch(`${apiBase}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      })
      const data = await response.json()
      setAnswer(data.answer || 'No answer available.')
    } catch (error) {
      setAnswer('Failed to fetch answer. Check the backend.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">AI Assistant</h2>
      <form onSubmit={handleAsk} className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">Ask the crime analytics platform</label>
        <textarea
          rows={4}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
        />
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700"
            disabled={loading}
          >
            {loading ? 'Querying...' : 'Ask AI'}
          </button>
        </div>
      </form>
      <div className="mt-6 rounded-3xl bg-slate-50 p-5 text-sm text-slate-700">
        <h3 className="mb-3 text-base font-semibold">Answer</h3>
        <p>{answer || 'Enter a question and press Ask AI to get insights.'}</p>
      </div>
    </div>
  )
}

export default AiAssistant
