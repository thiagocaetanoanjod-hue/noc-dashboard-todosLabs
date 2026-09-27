import React from "react";

export class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Falha não tratada na interface do NOC:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="container py-5 text-center text-light">
          <h1 className="h3 text-danger">Interface indisponível</h1>
          <p>O painel encontrou uma falha inesperada. Recarregue a página para tentar novamente.</p>
          <button className="btn btn-outline-info" onClick={() => window.location.reload()}>
            Recarregar painel
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}