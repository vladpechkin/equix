import React, { ErrorInfo, ReactNode } from "react";
import { ErrorPage } from "./ErrorPage";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError || !this.props.children) {
      return <ErrorPage />;
    }

    return this.props.children;
  }
}
