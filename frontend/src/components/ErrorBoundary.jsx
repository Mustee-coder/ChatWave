import { Component } from "react";
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-base-100">
          <div className="max-w-md w-full text-center space-y-4">
            <div className="mx-auto size-16 rounded-full bg-error/10 flex items-center justify-center">
              <AlertTriangleIcon className="size-8 text-error" />
            </div>
            <h1 className="text-xl font-bold">Something went wrong</h1>
            <p className="text-sm opacity-60">
              An unexpected error occurred. Please try reloading the page.
            </p>
            <button
              onClick={this.handleReload}
              className="btn btn-primary gap-2 mt-2"
            >
              <RefreshCwIcon className="size-4" />
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;