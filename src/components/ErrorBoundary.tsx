import React from "react";

interface ErrorBoundaryState {
    hasError: boolean
}

export class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {

    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_error: any) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        // TODO log the error to an error reporting service
    }

    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong. Try refreshing the page.</h1>;
        }
        return this.props.children;
    }
}