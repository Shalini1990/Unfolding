import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[Unfolding] Uncaught error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-boundary">
          <p className="error-boundary__title">Something went wrong.</p>
          <p className="error-boundary__sub">Try refreshing the page. Your data is safe.</p>
          <button
            className="error-boundary__btn"
            onClick={() => window.location.reload()}
            type="button"
          >
            Refresh
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
