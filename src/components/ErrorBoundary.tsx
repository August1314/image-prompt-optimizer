import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="error-boundary" style={{
          padding: '2rem',
          textAlign: 'center',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          background: 'var(--surface)',
        }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text)' }}>
            Something went wrong
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            An unexpected error occurred. Please try again.
          </p>
          {this.state.error && (
            <details style={{ marginBottom: '1rem', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>
                Error details
              </summary>
              <pre style={{ 
                marginTop: '0.5rem', 
                padding: '0.5rem',
                background: 'var(--background)',
                borderRadius: '4px',
                fontSize: '0.85rem',
                overflow: 'auto',
              }}>
                {this.state.error.message}
              </pre>
            </details>
          )}
          <button 
            onClick={this.handleReset}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
