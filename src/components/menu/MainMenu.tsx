import React, { useState, useEffect, useRef } from 'react';
import { BRANDING } from '../../core/constants/branding';
import { useGameEngine } from '../../engine/GameEngine';
import { SaveGameService, LocalStorageSaveRepository, SaveMetadata } from '../../core/domain/saveSystem';
import { createInitialGameState } from '../../core/state/initialState';
import {
  GoatCard,
  GoatButton,
  GoatBadge,
  GoatStatHeader,
  GoatModal,
  GOAT_TOKENS
} from '../ui/goat';
import {
  Play,
  Plus,
  Save,
  Trash2,
  Download,
  Upload,
  AlertCircle,
  Settings as SettingsIcon,
  CheckCircle2,
  User,
  Shield,
  Volume2,
  VolumeX,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export default function MainMenu() {
  const { dispatch } = useGameEngine();
  const [saves, setSaves] = useState<SaveMetadata[]>([]);
  const [service] = useState(() => new SaveGameService(new LocalStorageSaveRepository()));
  const [isLoadingSaves, setIsLoadingSaves] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modals / Dialogs State
  const [isSavesModalOpen, setIsSavesModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  // Save Action States
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [importJson, setImportJson] = useState('');
  
  // Settings Local States
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autosaveEnabled, setAutosaveEnabled] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    refreshSaves();
  }, []);

  const refreshSaves = () => {
    setIsLoadingSaves(true);
    try {
      const available = service.getAvailableSaves();
      setSaves(available);
      setError(null);
    } catch (e) {
      setError('Erro ao carregar lista de saves do armazenamento local.');
    } finally {
      setIsLoadingSaves(false);
    }
  };

  const handleNewCareer = () => {
    try {
      const newSlotId = `career_${Date.now()}`;
      const newState = createInitialGameState();
      newState.phase = 'CREATION_BASIC_INFO';
      newState.saveSlot = newSlotId;

      // Save initial state so slot is registered
      service.saveGame(newSlotId, newState);

      dispatch({ type: 'SET_STATE', payload: newState });
    } catch (e) {
      setError(`Erro ao iniciar nova carreira: ${(e as Error).message || 'Falha ao salvar'}`);
    }
  };

  const handleContinue = () => {
    if (saves.length > 0) {
      handleLoad(saves[0].id);
    }
  };

  const handleLoad = (slotId: string) => {
    try {
      const state = service.loadGame(slotId);
      if (state) {
        state.saveSlot = slotId;
        dispatch({ type: 'SET_STATE', payload: state });
      } else {
        setError('Não foi possível carregar este save. Dados ausentes.');
      }
    } catch (e) {
      setError(`Save corrompido ou incompatível: ${(e as Error).message || 'Erro de parsing'}`);
    }
  };

  const handleDelete = (slotId: string) => {
    try {
      service.deleteSave(slotId);
      setDeleteConfirmId(null);
      refreshSaves();
    } catch (e) {
      setError('Erro ao excluir save do armazenamento local.');
    }
  };

  const handleExport = (slotId: string) => {
    try {
      const json = service.exportSave(slotId);
      if (!json) return;

      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `goat_simulator_save_${slotId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      setError('Falha ao exportar arquivo de save.');
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const newSlotId = `career_${Date.now()}`;
        service.importSave(newSlotId, json);
        setIsImportModalOpen(false);
        refreshSaves();
      } catch (err) {
        setError(`Erro ao importar arquivo: ${(err as Error).message || 'Formato JSON inválido'}`);
      }
    };
    reader.readAsText(file);
  };

  const handleImportText = () => {
    if (!importJson.trim()) return;
    try {
      const newSlotId = `career_${Date.now()}`;
      service.importSave(newSlotId, importJson);
      setImportJson('');
      setIsImportModalOpen(false);
      refreshSaves();
    } catch (err) {
      setError(`Erro ao importar texto: ${(err as Error).message || 'JSON inválido'}`);
    }
  };

  const activeSave = saves.length > 0 ? saves[0] : null;

  return (
    <div className="relative z-10 my-auto flex w-full max-w-4xl flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Abstract Football Backdrop Lighting */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Spotlight Beam */}
        <div className="absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-transparent blur-3xl" />
        {/* Pitch Lines Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(#1f1f23_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      {/* Top Bar: Version & System Badges */}
      <div className="relative z-10 mb-6 flex w-full flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2">
          <GoatBadge variant="gold" oblique>
            v1.0.0 ALPHA
          </GoatBadge>
          <GoatBadge variant={autosaveEnabled ? 'victory' : 'neutral'} icon={<CheckCircle2 className="h-3 w-3" />}>
            {autosaveEnabled ? 'Autosave Ativo' : 'Autosave Pausado'}
          </GoatBadge>
        </div>

        <button
          onClick={() => setIsSettingsModalOpen(true)}
          className={`flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs font-bold text-zinc-300 transition-colors hover:border-amber-500/50 hover:text-white ${GOAT_TOKENS.focusState}`}
        >
          <SettingsIcon className="h-3.5 w-3.5 text-amber-400" />
          <span>Configurações</span>
        </button>
      </div>

      {/* Main Brand Title & Slogan */}
      <div className="relative z-10 mb-4 text-center flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-amber-400 mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Simulador Oficial de Carreira</span>
        </div>

        {BRANDING.assets.logoHorizontal ? (
          <img 
            src={BRANDING.assets.logoHorizontal} 
            alt={BRANDING.name} 
            className="w-full max-w-[80%] sm:max-w-[420px] md:max-w-[520px] h-auto object-contain mx-auto mb-2"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const textFallback = document.getElementById('logo-fallback');
              if (textFallback) textFallback.style.display = 'block';
            }}
          />
        ) : null}
        <h1 
          id="logo-fallback" 
          className="font-goat-display text-4xl font-black uppercase tracking-wider text-amber-400 goat-gold-text-glow sm:text-6xl md:text-7xl mb-2 mx-auto"
          style={{ display: BRANDING.assets.logoHorizontal ? 'none' : 'block' }}
        >
          {BRANDING.name}
        </h1>
        <p className="font-goat-body text-sm font-bold uppercase tracking-widest text-zinc-400 sm:text-base">
          {BRANDING.slogan} — Construa seu Legado Imortal
        </p>
      </div>

      {/* Dismissible Error Banner */}
      {error && (
        <div className="relative z-10 mb-4 w-full animate-in fade-in slide-in-from-top-2">
          <GoatCard variant="defeat" className="flex items-start justify-between gap-3 p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
              <div>
                <p className="text-xs font-bold text-rose-200 sm:text-sm">{error}</p>
                <p className="text-[11px] text-rose-300/80">Tente recarregar ou verificar o arquivo importado.</p>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="rounded-lg p-1 text-xs font-bold text-rose-300 hover:bg-rose-950/50 hover:text-white"
            >
              ✕
            </button>
          </GoatCard>
        </div>
      )}

      {/* Featured Active Career Card (if exists) */}
      {activeSave && (
        <div className="relative z-10 mb-8 w-full">
          <GoatCard variant="gold" glow obliqueHeader headerTitle="Carreira em Andamento">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {/* Athlete Silhouette / Avatar Frame */}
                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-2 border-amber-500/60 bg-zinc-900/90 shadow-xl shadow-amber-500/10">
                  <User className="h-10 w-10 text-amber-400" />
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-black">
                    ★
                  </span>
                </div>

                {/* Player & Club Information */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-zinc-100 sm:text-3xl">
                      {activeSave.playerName || 'Jogador Sem Nome'}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-zinc-300">
                    <span className="flex items-center gap-1 text-amber-300">
                      <Shield className="h-3.5 w-3.5" />
                      {activeSave.clubName}
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span>{activeSave.age} anos</span>
                    <span className="text-zinc-600">•</span>
                    <span>Temporada {activeSave.season}</span>
                  </div>

                  <p className="text-[11px] font-medium text-zinc-400">
                    Salvo em: {new Date(activeSave.lastUpdated).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>

              {/* Overall Stat Header & Action */}
              <div className="flex flex-col items-start gap-3 sm:items-end sm:justify-center">
                <GoatStatHeader
                  label="Overall Atleta"
                  value={activeSave.overall || 75}
                  subValue="GER"
                  size="lg"
                  highlight
                />

                <GoatButton
                  variant="primary"
                  size="lg"
                  glow
                  fullWidth
                  leftIcon={<Play className="h-5 w-5 fill-current" />}
                  onClick={handleContinue}
                  className="sm:w-auto sm:px-8"
                >
                  Continuar Carreira
                </GoatButton>
              </div>
            </div>
          </GoatCard>
        </div>
      )}

      {/* Main Action Grid */}
      <div className="relative z-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <GoatButton
          variant={activeSave ? 'secondary' : 'primary'}
          size="lg"
          glow={!activeSave}
          fullWidth
          leftIcon={<Plus className="h-5 w-5" />}
          onClick={handleNewCareer}
        >
          Iniciar Nova Carreira
        </GoatButton>

        <GoatButton
          variant="secondary"
          size="lg"
          fullWidth
          leftIcon={<Save className="h-5 w-5 text-amber-400" />}
          onClick={() => setIsSavesModalOpen(true)}
        >
          Gerenciar Saves ({saves.length})
        </GoatButton>
      </div>

      {/* Footer Info */}
      <footer className="relative z-10 mt-12 text-center text-xs font-semibold text-zinc-500">
        <p>{BRANDING.name} © 2026 — Todos os direitos reservados.</p>
      </footer>

      {/* MODAL 1: SAVES MANAGER */}
      <GoatModal
        isOpen={isSavesModalOpen}
        onClose={() => setIsSavesModalOpen(false)}
        title="Gerenciador de Carreiras"
        subtitle="Carregue, exporte ou exclua seus dados salvos"
        size="lg"
        footer={
          <div className="flex w-full items-center justify-between">
            <GoatButton
              variant="outline"
              size="sm"
              leftIcon={<Upload className="h-4 w-4" />}
              onClick={() => {
                setIsSavesModalOpen(false);
                setIsImportModalOpen(true);
              }}
            >
              Importar Save
            </GoatButton>

            <GoatButton variant="secondary" size="sm" onClick={() => setIsSavesModalOpen(false)}>
              Fechar
            </GoatButton>
          </div>
        }
      >
        {isLoadingSaves ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent mb-2" />
            <span className="text-xs font-bold uppercase tracking-wider">Buscando Arquivos...</span>
          </div>
        ) : saves.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-500">
            <User className="h-12 w-12 text-zinc-700 mb-2" />
            <p className="font-bold text-zinc-300">Nenhum save localizado</p>
            <p className="text-xs text-zinc-500 max-w-sm mt-1">
              Inicie uma nova carreira para registrar o seu progresso no simulador.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {saves.map((save) => (
              <GoatCard key={save.id} variant="mineral" padding="sm" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div
                  className="flex-1 cursor-pointer rounded-lg p-1 transition-colors hover:bg-zinc-800/50"
                  onClick={() => {
                    handleLoad(save.id);
                    setIsSavesModalOpen(false);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleLoad(save.id);
                      setIsSavesModalOpen(false);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-base">{save.playerName || 'Jogador Desconhecido'}</span>
                    <GoatBadge variant="gold" size="sm">
                      GER {save.overall || 75}
                    </GoatBadge>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-400 mt-1">
                    <span className="text-amber-400">{save.clubName}</span>
                    <span>•</span>
                    <span>{save.age} anos</span>
                    <span>•</span>
                    <span>Temporada {save.season}</span>
                  </div>

                  <span className="text-[10px] text-zinc-500 block mt-1">
                    {new Date(save.lastUpdated).toLocaleString('pt-BR')}
                  </span>
                </div>

                <div className="flex items-center gap-2 border-t border-zinc-800 pt-2 sm:border-t-0 sm:pt-0">
                  <GoatButton
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      handleLoad(save.id);
                      setIsSavesModalOpen(false);
                    }}
                  >
                    Carregar
                  </GoatButton>

                  <GoatButton
                    variant="secondary"
                    size="sm"
                    onClick={() => handleExport(save.id)}
                    title="Exportar Save JSON"
                  >
                    <Download className="h-4 w-4" />
                  </GoatButton>

                  {deleteConfirmId === save.id ? (
                    <div className="flex items-center gap-1">
                      <GoatButton variant="danger" size="sm" onClick={() => handleDelete(save.id)}>
                        Confirmar
                      </GoatButton>
                      <GoatButton variant="ghost" size="sm" onClick={() => setDeleteConfirmId(null)}>
                        Cancelar
                      </GoatButton>
                    </div>
                  ) : (
                    <GoatButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirmId(save.id)}
                      className="text-rose-400 hover:bg-rose-950/40 hover:text-rose-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </GoatButton>
                  )}
                </div>
              </GoatCard>
            ))}
          </div>
        )}
      </GoatModal>

      {/* MODAL 2: IMPORT SAVE */}
      <GoatModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Importar Carreira"
        subtitle="Carregue um arquivo JSON gerado em outra sessão"
        size="md"
        footer={
          <GoatButton variant="secondary" size="sm" onClick={() => setIsImportModalOpen(false)}>
            Cancelar
          </GoatButton>
        }
      >
        <div className="space-y-5">
          <div>
            <p className="text-xs text-zinc-400 mb-2 font-semibold">1. Selecione um arquivo `.json` do seu dispositivo:</p>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleImportFile}
              className="hidden"
            />
            <GoatButton
              variant="outline"
              fullWidth
              leftIcon={<Upload className="h-4 w-4" />}
              onClick={() => fileInputRef.current?.click()}
            >
              Escolher Arquivo JSON
            </GoatButton>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px bg-zinc-800 flex-1" />
            <span className="text-[11px] font-extrabold uppercase text-zinc-500">OU COLE O CÓDIGO</span>
            <div className="h-px bg-zinc-800 flex-1" />
          </div>

          <div className="space-y-3">
            <p className="text-xs text-zinc-400 font-semibold">2. Cole o conteúdo do arquivo abaixo:</p>
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder="Cole o JSON do save aqui..."
              className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-zinc-200 resize-none focus:outline-none focus:border-amber-500"
            />
            <GoatButton
              variant="primary"
              fullWidth
              disabled={!importJson.trim()}
              onClick={handleImportText}
            >
              Importar Texto
            </GoatButton>
          </div>
        </div>
      </GoatModal>

      {/* MODAL 3: SETTINGS */}
      <GoatModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="Configurações do Simulador"
        subtitle="Preferências do sistema e armazenamento"
        size="md"
        footer={
          <GoatButton variant="primary" size="sm" onClick={() => setIsSettingsModalOpen(false)}>
            Salvar e Fechar
          </GoatButton>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
            <div className="flex items-center gap-3">
              {soundEnabled ? <Volume2 className="h-5 w-5 text-amber-400" /> : <VolumeX className="h-5 w-5 text-zinc-500" />}
              <div>
                <span className="font-bold text-sm text-zinc-100 block">Efeitos Sonoros & Áudio</span>
                <span className="text-xs text-zinc-400">Feedback sonoro durante partidas e menus</span>
              </div>
            </div>
            <GoatButton
              variant={soundEnabled ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? 'Ativado' : 'Desativado'}
            </GoatButton>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <div>
                <span className="font-bold text-sm text-zinc-100 block">Autosave Automático</span>
                <span className="text-xs text-zinc-400">Salvar progresso após cada avanço de semana</span>
              </div>
            </div>
            <GoatButton
              variant={autosaveEnabled ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setAutosaveEnabled(!autosaveEnabled)}
            >
              {autosaveEnabled ? 'Ativado' : 'Pausado'}
            </GoatButton>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 space-y-2">
            <span className="font-bold text-sm text-zinc-100 block">Informações da Plataforma</span>
            <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
              <div>
                <span className="block text-zinc-500">Versão do Engine</span>
                <span className="font-mono text-zinc-200">v1.0.0 Alpha (GOAT Core)</span>
              </div>
              <div>
                <span className="block text-zinc-500">Saves no Dispositivo</span>
                <span className="font-bold text-amber-400">{saves.length} Registros</span>
              </div>
            </div>
          </div>
        </div>
      </GoatModal>
    </div>
  );
}
