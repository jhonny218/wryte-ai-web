import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-bold text-destructive">Something went wrong!</h2>
          <p className="text-muted-foreground">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
