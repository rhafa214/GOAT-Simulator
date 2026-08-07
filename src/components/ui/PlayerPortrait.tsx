import { BRANDING } from '../../core/constants/branding';
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { PlayerAttributes } from '../../types';
import { useGameEngine } from '../../engine/GameEngine';
import { AvatarManagerProvider } from '../3d/AvatarManager';

const AvatarScene = lazy(() => import('../3d/AvatarScene'));

// 1. Detect WebGL Support
export function hasWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

// 2. Error Boundary for 3D Canvas
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class AvatarErrorBoundary extends React.Component<{ children: React.ReactNode, fallback: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode, fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('Erro no Avatar 3D capturado pelo Error Boundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// 3. 2D Fallback / Silhouette
export function PlayerPortraitFallback({ clubColor, onRetry }: { clubColor: string; onRetry?: () => void }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-center gap-4" data-testid="player-portrait-fallback">
      {/* Visual representation of 2D/Silhouette */}
      <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 flex items-center justify-center relative overflow-hidden" style={{ borderColor: clubColor }} data-testid="avatar-fallback-silhouette">
        <img src={BRANDING.assets.shield} alt="GOAT" className="w-12 h-12 object-contain opacity-50" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-zinc-200">Visualização 3D Indisponível</h4>
        <p className="text-xs text-zinc-500 max-w-[200px] mx-auto mt-1">Seu dispositivo ou navegador pode estar sem aceleração WebGL ativa.</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-400 active:scale-95 text-black rounded-xl text-xs font-bold transition-all"
          data-testid="retry-avatar-button"
        >
          Tentar carregar novamente
        </button>
      )}
    </div>
  );
}

// 4. Main Self-Sufficient PlayerPortrait
export function PlayerPortrait({ player, className = '', clubColorOverride }: { player: PlayerAttributes, className?: string, clubColorOverride?: string }) {
  const { state } = useGameEngine();
  const clubColor = clubColorOverride || state?.career?.currentClub?.primaryColor || '#111111';
  
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    setWebGLSupported(hasWebGLSupport());
  }, []);

  const handleRetry = () => {
    setRetryKey(prev => prev + 1);
  };

  // If WebGL support check is in progress, show loading spinner
  if (webGLSupported === null) {
    return (
      <div className={`w-full h-full min-h-[300px] relative ${className}`} aria-label="Verificando suporte WebGL" role="img">
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-3xl" aria-busy="true">
          <div className="w-8 h-8 rounded-full border-2 border-yellow-500/20 border-t-yellow-500 animate-spin" />
        </div>
      </div>
    );
  }

  // If WebGL is not supported, show the fallback directly without mounting R3F
  if (!webGLSupported) {
    return (
      <div className={`w-full h-full min-h-[300px] relative ${className}`} aria-label="Avatar do Jogador (Fallback 2D)" role="img" data-testid="player-portrait-no-webgl">
        <PlayerPortraitFallback clubColor={clubColor} />
      </div>
    );
  }

  return (
    <div className={`w-full h-full min-h-[300px] relative ${className}`} aria-label="Avatar 3D do Jogador" role="img" data-testid="player-portrait-container">
      <AvatarErrorBoundary key={retryKey} fallback={<PlayerPortraitFallback clubColor={clubColor} onRetry={handleRetry} />}>
        <AvatarManagerProvider initialAppearance={player.appearance}>
          <Suspense fallback={
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-3xl" aria-busy="true" aria-label="Carregando avatar 3D">
               <div className="w-8 h-8 rounded-full border-2 border-yellow-500/20 border-t-yellow-500 animate-spin" />
            </div>
          }>
            <AvatarScene 
              clubColor={clubColor} 
              pose="idle"
            />
          </Suspense>
        </AvatarManagerProvider>
      </AvatarErrorBoundary>
    </div>
  );
}
