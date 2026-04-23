import { useState } from 'react'
import PromptInput from './components/PromptInput'
import ClarificationStep from './components/ClarificationStep'
import ResultStep from './components/ResultStep'
import { optimizePrompt } from './lib/prompt-optimizer'
import type { ClarificationAnswer, OptimizationResult } from './lib/types'

// Re-export for backwards compatibility with components that import from App
export type { ClarificationAnswer, OptimizationResult }

type Step = 'input' | 'clarification' | 'result'

function App() {
  const [step, setStep] = useState<Step>('input')
  const [initialPrompt, setInitialPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<OptimizationResult | null>(null)
  const [clarificationAnswers, setClarificationAnswers] = useState<ClarificationAnswer[]>([])

  const handleInitialSubmit = async (prompt: string) => {
    setInitialPrompt(prompt)
    setError(null)
    setIsLoading(true)

    try {
      const response = await optimizePrompt(prompt, [])
      setResult(response)

      if (response.clarificationQuestions && response.clarificationQuestions.length > 0) {
        setClarificationAnswers(
          response.clarificationQuestions.map((q) => ({ question: q, answer: '' }))
        )
        setStep('clarification')
      } else {
        setStep('result')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process prompt. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClarificationSubmit = async (answers: ClarificationAnswer[]) => {
    setClarificationAnswers(answers)
    setError(null)
    setIsLoading(true)

    try {
      const response = await optimizePrompt(initialPrompt, answers)
      setResult(response)
      setStep('result')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate optimized prompt. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setStep('input')
    setInitialPrompt('')
    setResult(null)
    setError(null)
    setClarificationAnswers([])
  }

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '2rem', paddingTop: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Image Prompt Optimizer
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Transform rough ideas into polished prompts for AI image generators
        </p>
      </header>

      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {step === 'input' && (
        <PromptInput onSubmit={handleInitialSubmit} isLoading={isLoading} />
      )}

      {step === 'clarification' && result && (
        <ClarificationStep
          questions={result.clarificationQuestions || []}
          answers={clarificationAnswers}
          onSubmit={handleClarificationSubmit}
          isLoading={isLoading}
        />
      )}

      {step === 'result' && result && (
        <ResultStep
          result={result}
          onReset={handleReset}
        />
      )}
    </div>
  )
}

export default App
