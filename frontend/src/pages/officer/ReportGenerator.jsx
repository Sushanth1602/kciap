import React, { useState } from 'react'
import { FileText, Download, Printer, Settings, CheckCircle2, Loader2, Sparkles } from 'lucide-react'

export default function ReportGenerator() {
  const [reportType, setReportType] = useState('FIR Summary PDF')
  const [district, setDistrict] = useState('All Districts')
  const [format, setFormat] = useState('PDF Format')
  const [generating, setGenerating] = useState(false)
  const [compiledReport, setCompiledReport] = useState(null)
  const [logs, setLogs] = useState([])

  const handleGenerate = (e) => {
    e.preventDefault()
    setGenerating(true)
    setCompiledReport(null)
    setLogs(['Accessing database records...', 'Sanitizing suspect identifiers...'])

    setTimeout(() => {
      setLogs((prev) => [...prev, 'Running geospatial trend analysis...', 'Resolving witness logs...'])
    }, 800)

    setTimeout(() => {
      setLogs((prev) => [...prev, 'Applying digital cryptographic seal...', 'Compiling report draft...'])
    }, 1600)

    setTimeout(() => {
      setGenerating(false)
      setCompiledReport({
        id: `KSP-RPT-${Math.floor(100000 + Math.random() * 900000)}`,
        title: `${reportType} - ${district}`,
        date: new Date().toLocaleString(),
        type: reportType,
        district: district,
        format: format,
        officer: 'Duty Inspector',
        hash: 'SHA256: 4a8b9f0e...d3c2a1'
      })
    }, 2400)
  }

  const printReport = () => {
    window.print()
  }

  return (
    <div className="space-y-6 select-none text-slate-350 text-left">
      {/* Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 w-full h-1 bg-govgold"></div>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-govgold/10 rounded-xl text-govgold border border-govgold/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wide">Report & Case File Compiler</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              Compile encrypted intelligence briefs and official court reports with cryptographic state seals
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Panel: Parameters Form */}
        <div className="lg:col-span-5 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-850 pb-3 mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4 text-govgold" />
            Compilation Parameters
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Report Format</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white focus:outline-none"
              >
                <option value="FIR Summary PDF">FIR Consolidated Summary</option>
                <option value="Monthly Beat Audit">Monthly Patrol Beat Audit</option>
                <option value="Case Closing File">Case Closing & Charge Sheet Brief</option>
                <option value="District Crime Trend">District Crime Trend Matrix</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jurisdiction</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white focus:outline-none"
                >
                  <option value="All Districts">All Districts</option>
                  <option value="Bengaluru Urban">Bengaluru Urban</option>
                  <option value="Mysuru">Mysuru</option>
                  <option value="Hubballi">Hubballi</option>
                  <option value="Mangaluru">Mangaluru</option>
                  <option value="Belagavi">Belagavi</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Export Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white focus:outline-none"
                >
                  <option value="PDF Format">Official PDF (.pdf)</option>
                  <option value="Excel spreadsheet">Data Excel (.xlsx)</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-950/40 p-4 border border-slate-850 rounded-2xl space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Security Protocol</span>
              <p className="text-[9px] text-slate-550 leading-relaxed font-semibold">
                This document contains confidential intelligence. The output files will be watermarked with your KSP credentials and cryptographic SHA256 hashes.
              </p>
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full py-2.5 bg-govgold hover:bg-yellow-500 text-govnavy rounded-xl text-xs font-bold uppercase tracking-wider transition border-b-4 border-yellow-700 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-govnavy" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-govnavy" />
                  Compile State Report
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Panel: Output Brief */}
        <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[380px]">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-850 pb-3 mb-4">
              Compiler Output Terminal
            </h3>

            {generating && (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-govgold animate-spin" />
                <div className="text-center font-mono space-y-1">
                  {logs.map((log, idx) => (
                    <p key={idx} className="text-[10px] text-slate-500">{log}</p>
                  ))}
                </div>
              </div>
            )}

            {!generating && !compiledReport && (
              <div className="py-16 text-center text-slate-500 text-xs font-semibold uppercase flex flex-col items-center justify-center gap-3">
                <FileText className="w-12 h-12 text-slate-700" />
                <span>Specify parameters and select compile on the left pane.</span>
              </div>
            )}

            {!generating && compiledReport && (
              <div className="space-y-4 border border-slate-800 rounded-2xl p-5 bg-slate-950 font-mono text-xs">
                <div className="flex items-start justify-between border-b border-slate-850 pb-3">
                  <div>
                    <span className="text-[9px] px-2 py-0.5 bg-govgold text-govnavy rounded font-bold uppercase">
                      {compiledReport.id}
                    </span>
                    <h4 className="text-white font-bold text-sm mt-1.5 uppercase leading-normal">{compiledReport.title}</h4>
                    <span className="text-[9px] text-slate-500 font-semibold">{compiledReport.date}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={printReport}
                      className="p-2 bg-slate-900 border border-slate-800 hover:border-govgold rounded-lg text-slate-350 hover:text-white transition"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => alert(`Downloading ${compiledReport.title}.${compiledReport.format === 'PDF Format' ? 'pdf' : 'xlsx'}`)}
                      className="p-2 bg-slate-900 border border-slate-800 hover:border-govgold rounded-lg text-slate-350 hover:text-white transition"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 text-[10px]">
                  <div>
                    <span className="text-slate-500 font-bold uppercase">Report Category:</span>
                    <p className="text-slate-300 font-bold">{compiledReport.type}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold uppercase">Target Area:</span>
                    <p className="text-slate-300 font-bold">{compiledReport.district}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold uppercase">Cryptographic Hash:</span>
                    <p className="text-slate-400 break-all">{compiledReport.hash}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold uppercase">Authorized Officer:</span>
                    <p className="text-slate-300 font-bold">{compiledReport.officer}</p>
                  </div>
                </div>

                <div className="border-t border-slate-850 pt-3 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-450 leading-relaxed font-semibold">
                    Document compiled successfully. State intelligence seals applied. Suitable for print log inclusion.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-850 text-center text-[9px] text-slate-600 font-bold uppercase">
            Official Karnataka State Police Record Database Terminal
          </div>
        </div>
      </div>
    </div>
  )
}
