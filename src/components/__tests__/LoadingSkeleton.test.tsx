import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingSkeleton from '../LoadingSkeleton'

describe('LoadingSkeleton', () => {
  it('renders clarification skeleton with aria-busy', () => {
    render(<LoadingSkeleton step="clarification" />)
    expect(screen.getByLabelText(/loading results/i)).toHaveAttribute('aria-busy', 'true')
  })

  it('renders result skeleton with aria-busy', () => {
    render(<LoadingSkeleton step="result" />)
    expect(screen.getByLabelText(/loading results/i)).toHaveAttribute('aria-busy', 'true')
  })

  it('renders skeleton lines in clarification step', () => {
    render(<LoadingSkeleton step="clarification" />)
    const skeleton = screen.getByLabelText(/loading results/i)
    expect(skeleton.querySelectorAll('.skeleton-line').length).toBeGreaterThanOrEqual(3)
  })

  it('renders skeleton lines in result step', () => {
    render(<LoadingSkeleton step="result" />)
    const skeleton = screen.getByLabelText(/loading results/i)
    expect(skeleton.querySelectorAll('.skeleton-line').length).toBeGreaterThanOrEqual(3)
  })
})
