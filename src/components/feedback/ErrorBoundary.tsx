import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

type NewRelicWindow = Window & {
  newrelic?: {
    noticeError: (error: Error, customAttributes?: Record<string, unknown>) => void;
  };
};

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);

    // Report error to New Relic if available
    try {
      const win = window as NewRelicWindow;
      if (win.newrelic?.noticeError) {
        win.newrelic.noticeError(error, {
          componentStack: errorInfo.componentStack,
          errorBoundary: true,
        });
      }
    } catch {
      // Silently ignore if New Relic reporting fails
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
          <h2 className="text-destructive text-2xl font-bold">Something went wrong!</h2>
          <p className="text-muted-foreground">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
