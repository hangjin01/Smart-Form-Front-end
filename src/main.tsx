import React, { Component, ErrorInfo, ReactNode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Simple Error Boundary for Debugging
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: Error | null }> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: 40, color: '#ef4444', backgroundColor: '#0f172a', minHeight: '100vh' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Something went wrong (React Error)</h1>
                    <pre style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '8px', overflow: 'auto', fontFamily: 'monospace', fontSize: '14px', border: '1px solid #ef4444' }}>
                        {this.state.error?.toString()}
                        <br />
                        {this.state.error?.stack}
                    </pre>
                </div>
            );
        }

        return this.props.children;
    }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
    document.body.innerHTML += '<div style="color:red">ROOT ELEMENT NOT FOUND</div>';
} else {
    try {
        ReactDOM.createRoot(rootElement).render(
            <React.StrictMode>
                <ErrorBoundary>
                    <App />
                </ErrorBoundary>
            </React.StrictMode>,
        )
    } catch (e: any) {
        document.body.innerHTML += `<div style="color:red; padding:20px;">
      <h1>Render Error</h1>
      <pre>${e?.toString()}</pre>
    </div>`;
    }
}
