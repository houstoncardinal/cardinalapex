import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Card className="p-6 bg-destructive/10 border-destructive/30">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <h3 className="font-semibold text-destructive">Something went wrong</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {this.props.fallbackMessage || 'An error occurred while rendering this component.'}
          </p>
          {this.state.error && (
            <pre className="text-xs bg-muted p-2 rounded mb-4 overflow-auto max-h-32">
              {this.state.error.message}
            </pre>
          )}
          <Button onClick={this.handleRetry} size="sm" variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </Card>
      );
    }

    return this.props.children;
  }
}
