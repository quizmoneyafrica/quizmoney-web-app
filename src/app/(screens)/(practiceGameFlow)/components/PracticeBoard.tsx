import React, { useState } from 'react'
import { usePracticeStore } from '@/lib/practice-store'

export default function PracticeBoard() {
  const { 
    currentQuestion, 
    currentQuestionIndex, 
    totalQuestions, 
    score, 
    eraserUsed, 
    loading, 
    error,
    submitAnswerHttp,
    quitSessionHttp
  } = usePracticeStore()

  const [selected, setSelected] = useState<'a' | 'b' | 'c' | 'd' | null>(null)

  if (!currentQuestion) return null

  const optionsMap = [
    { key: 'a', value: currentQuestion.option_a },
    { key: 'b', value: currentQuestion.option_b },
    { key: 'c', value: currentQuestion.option_c },
    { key: 'd', value: currentQuestion.option_d },
  ]

  const handleCommitSelection = () => {
    if (selected) {
      submitAnswerHttp(currentQuestionIndex, selected)
      setSelected(null)
    }
  }

  console.log("Current ", currentQuestion);
  
  return (
    <div className="w-full max-w-xl mx-auto bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-black">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Question Progress</span>
          <p className="text-sm font-semibold text-gray-700">{currentQuestionIndex + 1} of {totalQuestions}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${
            !eraserUsed ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-400 border-gray-200'
          }`}>
            🛡️ {!eraserUsed ? 'Eraser Active' : 'Eraser Spent'}
          </span>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 text-xs font-bold rounded-md">
            Points: {score}
          </span>
        </div>
      </div>

      <p className="text-base font-medium text-gray-900 mb-6">{currentQuestion.question_text}</p>

      <div className="grid grid-cols-1 gap-2.5 mb-6">
        {optionsMap.map(({ key, value }) => (
          <button
            key={key}
            onClick={() => setSelected(key as any)}
            className={`w-full text-left p-4 rounded-xl border transition-all text-sm ${
              selected === key 
                ? 'border-black bg-gray-50 font-medium' 
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <span className="font-bold uppercase mr-2 text-gray-400">{key}.</span> {value}
          </button>
        ))}
      </div>

      {error && <p className="text-red-500 text-xs mb-4 font-semibold">{error}</p>}

      <div className="flex justify-between items-center">
        <button 
          onClick={quitSessionHttp}
          className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors"
        >
          Quit Practice
        </button>
        <button
          onClick={handleCommitSelection}
          disabled={!selected || loading}
          className="px-5 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:bg-gray-100 disabled:text-gray-400 transition-all"
        >
          {loading ? 'Submitting...' : 'Next Question'}
        </button>
      </div>
    </div>
  )
}