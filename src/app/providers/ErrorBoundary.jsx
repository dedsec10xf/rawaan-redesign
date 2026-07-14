import { Component } from 'react';

// Route-content error boundary — class component because React only
// supports error boundaries via getDerivedStateFromError/componentDidCatch,
// no hook equivalent exists. Renders a plain panel instead of the white
// screen a thrown render error otherwise leaves behind (see the
// fairy-meadows/rakaposhi-base-camp incident this was added after — a bad
// data reference crashed the whole tree with nothing catching it). The
// error's message + stack are shown only in DEV; PROD gets a generic
// message with no internals leaked.
export class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div role="alert" className="container-editorial py-24 text-center md:py-32">
        <h1 className="font-display text-h2 text-navy">Something went wrong</h1>
        <p className="mt-3 text-body text-slate">
          {import.meta.env.DEV ? error.message : 'Please refresh the page, or try again shortly.'}
        </p>
        {import.meta.env.DEV && error.stack && (
          <pre className="mt-6 overflow-auto rounded-xl border border-line bg-mist p-4 text-left text-small text-slate">
            {error.stack}
          </pre>
        )}
      </div>
    );
  }
}
