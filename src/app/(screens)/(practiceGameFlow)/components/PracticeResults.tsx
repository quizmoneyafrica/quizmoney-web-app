import React from 'react'
import { usePracticeStore } from '@/lib/practice-store'

export default function PracticeResults() {
  const { summary, reset } = usePracticeStore()

  if (!summary) return null

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-gray-200 p-8 rounded-2xl shadow-sm text-black">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Drill Completed</h2>
        <p className="text-sm text-gray-400 mt-1">Review your summary performance below.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Accuracy', value: `${summary.accuracy}%`, color: 'text-indigo-600' },
          { label: 'Final Score', value: `${summary.score}/${summary.totalQuestions}`, color: 'text-emerald-600' },
          { label: 'Auto-Corrected', value: summary.autoCorrected, color: 'text-amber-600' },
          { label: 'Time Elapsed', value: `${summary.durationSeconds}s`, color: 'text-gray-800' },
        ].map((item, index) => (
          <div key={index} className="bg-gray-50 border border-gray-100 p-4 rounded-xl text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{item.label}</span>
            <span className={`text-xl font-bold mt-1 block ${item.color}`}>{item.value}</span>
          </div>
        ))}
      </div>

      <button
        onClick={reset}
        className="w-full py-3 bg-black hover:bg-gray-800 text-white font-medium text-sm rounded-xl transition-all"
      >
        Return to Lobby
      </button>
    </div>
  )
}