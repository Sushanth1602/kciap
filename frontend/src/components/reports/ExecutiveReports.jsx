import React, { useState } from 'react'
import { FileText, Printer, Download, CheckCircle, ShieldAlert } from 'lucide-react'

export default function ExecutiveReports({ summary, districts = [] }) {
  const [activeReport, setActiveReport] = useState(null)
  const [generating, setGenerating] = useState(false)

  const handleGenerate = (type) => {
    setGenerating(true)
    setTimeout(() => {
      setActiveReport(type)
      setGenerating(false)
    }, 1200)
  }

  const printReport = () => {
    window.print()
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-govnavy uppercase tracking-wide border-l-4 border-govgold pl-3">Executive Intelligence Reports</h2>
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Audits, summaries & resource allocations</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => handleGenerate('monthly')}
            className="px-4 py-2 bg-govnavy text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm border-b-2 border-slate-950"
          >
            <FileText className="w-3.5 h-3.5" />
            Monthly Summary
          </button>
          <button
            onClick={() => handleGenerate('district')}
            className="px-4 py-2 bg-white text-govnavy hover:bg-slate-50 rounded-xl text-xs font-bold border border-slate-350 transition flex items-center gap-1.5 shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            District Audit
          </button>
        </div>
      </div>

      {generating && (
        <div className="py-12 flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 border-4 border-t-govnavy border-slate-200 rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest animate-pulse">Compiling database logs...</span>
        </div>
      )}

      {!generating && !activeReport && (
        <div className="py-8 text-center text-slate-400 font-medium text-xs flex flex-col items-center justify-center gap-2">
          <FileText className="w-10 h-10 text-slate-300" />
          <span>Click one of the buttons above to compile and view state analytical records.</span>
        </div>
      )}

      {!generating && activeReport === 'monthly' && (
        <div className="space-y-6 border border-slate-200 rounded-2xl p-6 bg-slate-50 shadow-inner max-h-[500px] overflow-y-auto print:border-none print:shadow-none">
          <div className="flex items-start justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
            <div className="space-y-1">
              <span className="text-[9px] px-2 py-0.5 bg-govblue text-white rounded font-bold uppercase tracking-wider">KCIAP Audit Code: MR-{new Date().getMonth() + 1}-2026</span>
              <h3 className="text-base font-bold text-govnavy uppercase">State Crime Intelligence Brief (Consolidated)</h3>
              <p className="text-xs text-slate-500 font-medium">Reporting Period: June 2026 · Compiled for DG & IGP, Karnataka State Police</p>
            </div>
            <div className="flex gap-2 print:hidden">
              <button onClick={printReport} className="p-2 bg-white border border-slate-350 rounded-lg hover:bg-slate-50 shadow-sm text-slate-700">
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 text-xs md:text-sm">
            <div className="bg-white border p-4 rounded-xl shadow-sm">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Total Incidents</span>
              <p className="text-xl font-bold text-govnavy mt-1">{summary.total_crimes.toLocaleString()}</p>
            </div>
            <div className="bg-white border p-4 rounded-xl shadow-sm">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Clearance Rate</span>
              <p className="text-xl font-bold text-green-700 mt-1">
                {((summary.closed_cases / summary.total_crimes) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-white border p-4 rounded-xl shadow-sm">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Critical Severities</span>
              <p className="text-xl font-bold text-red-600 mt-1">{summary.high_severity_cases.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Executive Intelligence Summary</h4>
            <div className="p-4 bg-white rounded-xl border space-y-2.5 text-xs text-slate-600 leading-relaxed font-semibold">
              <div className="flex gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p>Strategic policing in rural zones has stabilized crime rates, yielding an overall resolution metrics improvement.</p>
              </div>
              <div className="flex gap-2">
                <ShieldAlert className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <p>Cybercrime financial scam counts continue to represent an elevated cluster concentration. Digital surveillance squads require mobilization.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400 font-bold select-none">
            CONFIDENTIAL REPORT · NOT FOR PUBLIC CIRCULATION · © KARNATAKA STATE POLICE
          </div>
        </div>
      )}

      {!generating && activeReport === 'district' && (
        <div className="space-y-6 border border-slate-200 rounded-2xl p-6 bg-slate-50 shadow-inner max-h-[500px] overflow-y-auto print:border-none print:shadow-none">
          <div className="flex items-start justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
            <div className="space-y-1">
              <span className="text-[9px] px-2 py-0.5 bg-govpurple text-white rounded font-bold uppercase tracking-wider">KCIAP Audit Code: DR-2026-HQ</span>
              <h3 className="text-base font-bold text-govnavy uppercase">District Safety Performance Audit</h3>
              <p className="text-xs text-slate-500 font-medium">Reporting Period: Year-To-Date (2026) · Consolidated Regional Analytics</p>
            </div>
            <div className="flex gap-2 print:hidden">
              <button onClick={printReport} className="p-2 bg-white border border-slate-350 rounded-lg hover:bg-slate-50 shadow-sm text-slate-700">
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="border bg-white rounded-xl overflow-hidden text-xs md:text-sm">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50 border-b text-[10px] font-bold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-2.5 text-left">District Headquarter</th>
                  <th className="px-4 py-2.5 text-right">Reported Count</th>
                  <th className="px-4 py-2.5 text-center">Threat Scoring</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                {districts.slice(0, 10).map((dist) => {
                  const isHighThreat = dist.count >= 150
                  return (
                    <tr key={dist.district}>
                      <td className="px-4 py-2.5 font-bold text-govnavy">{dist.district}</td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold">{dist.count} crimes</td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                          isHighThreat ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {isHighThreat ? 'CRITICAL THREAT' : 'STABLE CONTROL'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400 font-bold select-none">
            CONFIDENTIAL REPORT · NOT FOR PUBLIC CIRCULATION · © KARNATAKA STATE POLICE
          </div>
        </div>
      )}
    </div>
  )
}
