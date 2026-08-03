import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Global Error Caught:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleBackToMenu = () => {
    // Clear potentially corrupted session state if any, and reload to root path
    try {
      localStorage.removeItem('goat_autosave'); // Remove autosave if any corrupted state exists
    } catch (e) {}
    window.location.href = window.location.origin + window.location.pathname;
  };

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.DEV;

      return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 text-center select-none" data-testid="global-error-boundary">
          {/* Background Gradient Orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-md w-full relative z-10 flex flex-col items-center gap-6">
            {/* Error Icon */}
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-widest">Algo deu errado!</h1>
              <p className="text-zinc-400 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                Ocorreu um erro inesperado na renderização do simulador. Não se preocupe, seu progresso recente está salvo localmente.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={this.handleReload}
                className="flex-1 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 active:scale-95 text-black rounded-xl text-sm font-black transition-all shadow-lg shadow-yellow-500/10 uppercase tracking-wider"
                data-testid="reload-button"
              >
                Recarregar página
              </button>
              <button
                onClick={this.handleBackToMenu}
                className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-200 border border-zinc-700 rounded-xl text-sm font-bold transition-all uppercase tracking-wider"
                data-testid="back-to-menu-button"
              >
                Voltar ao menu
              </button>
            </div>

            {/* Technical details (Dev-only) */}
            {isDev && this.state.error && (
              <div className="w-full mt-4 text-left p-4 bg-zinc-900 border border-zinc-800 rounded-xl max-h-[180px] overflow-y-auto">
                <p className="text-xs font-bold text-red-400 mb-1">Detalhes Técnicos (Desenvolvimento):</p>
                <p className="text-[10px] font-mono text-zinc-500 break-all">{this.state.error.message}</p>
                {this.state.error.stack && (
                  <pre className="text-[9px] font-mono text-zinc-600 mt-2 whitespace-pre-wrap overflow-x-auto">
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
