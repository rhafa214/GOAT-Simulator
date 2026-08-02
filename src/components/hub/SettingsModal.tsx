import React, { useState } from 'react';
import { useGameEngine } from '../../engine/GameEngine';
import { GoatCard, GoatButton, GoatBadge } from '../ui/goat';
import { Settings, Volume2, VolumeX, Save, LogOut, X, ShieldAlert, Check } from 'lucide-react';
import { SaveGameService, LocalStorageSaveRepository } from '../../core/domain/saveSystem';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { state, dispatch } = useGameEngine();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showConfirmExit, setShowConfirmExit] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  if (!isOpen) return null;

  const handleSaveGame = () => {
    setSaveStatus('saving');
    try {
      const repo = new LocalStorageSaveRepository();
      const saveService = new SaveGameService(repo);
      saveService.saveGame('auto_save', state);
      setTimeout(() => {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }, 500);
    } catch (e) {
      setSaveStatus('idle');
    }
  };

  const handleExitToMenu = () => {
    // Save first then transition phase
    try {
      const repo = new LocalStorageSaveRepository();
      const saveService = new SaveGameService(repo);
      saveService.saveGame('auto_save', state);
    } catch (e) {
      // proceed anyway
    }
    dispatch({ type: 'CHANGE_PHASE', payload: 'MAIN_MENU' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative text-zinc-100 animate-in fade-in zoom-in duration-200">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          aria-label="Fechar Configurações"
        >
          <X className="h-5 w-5" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">Configurações</h2>
            <p className="text-xs text-zinc-400">Ajustes gerais do jogo e gerenciamento de carreira</p>
          </div>
        </div>

        {/* OPTIONS */}
        <div className="space-y-4 mb-6">
          
          {/* SOUND TOGGLE */}
          <div className="flex items-center justify-between p-4 bg-zinc-900/80 rounded-2xl border border-zinc-800">
            <div className="flex items-center gap-3">
              {soundEnabled ? <Volume2 className="h-5 w-5 text-amber-400" /> : <VolumeX className="h-5 w-5 text-zinc-500" />}
              <div>
                <span className="text-sm font-bold block">Efeitos Sonoros</span>
                <span className="text-[10px] text-zinc-500">Sons da interface e estádio</span>
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-colors ${
                soundEnabled ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {soundEnabled ? 'LIGADO' : 'DESLIGADO'}
            </button>
          </div>

          {/* SAVE CAREER BUTTON */}
          <div className="flex items-center justify-between p-4 bg-zinc-900/80 rounded-2xl border border-zinc-800">
            <div className="flex items-center gap-3">
              <Save className="h-5 w-5 text-emerald-400" />
              <div>
                <span className="text-sm font-bold block">Salvar Progresso</span>
                <span className="text-[10px] text-zinc-500">Salvar no slot local da carreira</span>
              </div>
            </div>
            <GoatButton
              variant={saveStatus === 'saved' ? 'secondary' : 'primary'}
              size="sm"
              onClick={handleSaveGame}
              disabled={saveStatus === 'saving'}
            >
              {saveStatus === 'saving' && 'Salvando...'}
              {saveStatus === 'saved' && (
                <span className="flex items-center gap-1 text-emerald-400">
                  <Check className="h-4 w-4" /> Salvo!
                </span>
              )}
              {saveStatus === 'idle' && 'Salvar Agora'}
            </GoatButton>
          </div>

        </div>

        {/* EXIT CONFIRMATION OR BUTTON */}
        {!showConfirmExit ? (
          <GoatButton
            variant="danger"
            size="lg"
            fullWidth
            leftIcon={<LogOut className="h-4 w-4" />}
            onClick={() => setShowConfirmExit(true)}
          >
            Sair para o Menu Principal
          </GoatButton>
        ) : (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl space-y-3 text-center">
            <div className="flex items-center justify-center gap-2 text-rose-400 font-extrabold text-xs uppercase">
              <ShieldAlert className="h-4 w-4" /> Confirmar Saída
            </div>
            <p className="text-xs text-zinc-300">
              Seu progresso será salvo automaticamente antes de retornar ao menu.
            </p>
            <div className="flex gap-2">
              <GoatButton
                variant="danger"
                size="md"
                fullWidth
                onClick={handleExitToMenu}
              >
                Confirmar & Sair
              </GoatButton>
              <GoatButton
                variant="secondary"
                size="md"
                fullWidth
                onClick={() => setShowConfirmExit(false)}
              >
                Cancelar
              </GoatButton>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
