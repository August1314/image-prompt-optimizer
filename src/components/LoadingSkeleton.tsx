/**
 * LoadingSkeleton — shows animated placeholder blocks during API calls.
 * Accepts a `step` prop to match the skeleton layout to the current step.
 */

interface Props {
  step: 'clarification' | 'result'
}

function SkeletonLine({ width = '100%', height = '1rem' }: { width?: string; height?: string }) {
  return (
    <div
      className="skeleton-line"
      style={{ width, height, borderRadius: '6px' }}
    />
  )
}

function SkeletonCard() {
  return (
    <div className="card">
      <div
        className="skeleton-line"
        style={{ width: '45%', height: '1.25rem', marginBottom: '1rem' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <SkeletonLine width="100%" height="0.95rem" />
        <SkeletonLine width="92%" height="0.95rem" />
        <SkeletonLine width="78%" height="0.95rem" />
      </div>
    </div>
  )
}

function LoadingSkeleton({ step }: Props) {
  return (
    <div className="loading-skeleton" aria-busy="true" aria-label="Loading results">
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div className="skeleton-line" style={{ width: '220px', height: '1.75rem', margin: '0 auto 0.5rem' }} />
        <div className="skeleton-line" style={{ width: '320px', height: '0.9rem', margin: '0 auto' }} />
      </div>

      {step === 'clarification' && (
        <div className="card">
          <div
            className="skeleton-line"
            style={{ width: '55%', height: '1.25rem', marginBottom: '1.5rem' }}
          />
          {[0, 1].map((i) => (
            <div key={i} style={{ marginBottom: '1.5rem' }}>
              <div
                className="skeleton-line"
                style={{ width: `${75 + i * 8}%`, height: '0.875rem', marginBottom: '0.5rem' }}
              />
              <SkeletonLine width="100%" height="60px" />
            </div>
          ))}
        </div>
      )}

      {step === 'result' && (
        <>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      )}
    </div>
  )
}

export default LoadingSkeleton
