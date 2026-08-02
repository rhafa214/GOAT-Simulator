import React, { useState, useEffect, useRef } from 'react';
import { useGameEngine } from '../../engine/GameEngine';
import { SaveGameService, LocalStorageSaveRepository, SaveMetadata } from '../../core/domain/saveSystem';
import { createInitialGameState } from '../../core/state/initialState';
import { Play, Plus, Save, Trash2, Download, Upload, AlertCircle, ArrowLeft } from 'lucide-react';

export default function MainMenu() {
  const { dispatch } = useGameEngine();
  const [saves, setSaves] = useState<SaveMetadata[]>([]);
  const [service] = useState(() => new SaveGameService(new LocalStorageSaveRepository()));
  const [view, setView] = useState<'main' | 'load' | 'import'>('main');
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [importJson, setImportJson] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    refreshSaves();
  }, [view]);

  const refreshSaves = () => {
    try {
      setSaves(service.getAvailableSaves());
    } catch (e) {
      setError('Erro ao carregar lista de saves.');
    }
  };

  const handleNewCareer = () => {
    const newSlotId = `career_${Date.now()}`;
    const newState = createInitialGameState();
    newState.phase = 'CREATION_BASIC_INFO';
    newState.saveSlot = newSlotId;
    
    // Save immediately so it occupies a slot
    service.saveGame(newSlotId, newState);
    
    dispatch({ type: 'SET_STATE', payload: newState });
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
        setError('Não foi possível carregar o save.');
      }
    } catch (e) {
      setError(`Erro ao carregar: ${(e as Error).message || "Erro desconhecido"}`);
    }
  };

  const handleDelete = (slotId: string) => {
    try {
      service.deleteSave(slotId);
      setDeleteConfirm(null);
      refreshSaves();
    } catch (e) {
      setError('Erro ao excluir save.');
    }
  };

  const handleExport = (slotId: string) => {
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
        setView('main');
        refreshSaves();
      } catch (err) {
        setError(`Erro ao importar: ${(err as Error).message || "Erro desconhecido"}`);
      }
    };
    reader.readAsText(file);
  };
  
  const handleImportText = () => {
    if (!importJson.trim()) return;
    try {
      const newSlotId = `career_${Date.now()}`;
      service.importSave(newSlotId, importJson);
      setView('main');
      refreshSaves();
    } catch (err) {
      setError(`Erro ao importar: ${(err as Error).message || "Erro desconhecido"}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto space-y-8 p-6 z-10 relative">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-5xl font-black tracking-tight text-white/90 drop-shadow-md">GOAT Simulator</h1>
        <p className="text-xl text-yellow-500/90 font-bold uppercase tracking-wider">O Fenômeno</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl flex items-center gap-3 w-full animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-200 text-xs uppercase font-bold">X</button>
        </div>
      )}

      {view === 'main' && (
        <div className="w-full flex flex-col gap-4">
          <button 
            onClick={handleNewCareer}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(234,179,8,0.3)]"
          >
            <Plus className="w-5 h-5" />
            NOVA CARREIRA
          </button>

          {saves.length > 0 && (
            <button 
              onClick={handleContinue}
              className="w-full bg-white/10 hover:bg-white/15 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all border border-white/5 backdrop-blur-md"
            >
              <Play className="w-5 h-5" />
              CONTINUAR CARREIRA ({saves[0].playerName})
            </button>
          )}

          <button 
            onClick={() => setView('load')}
            className="w-full bg-black/40 hover:bg-black/60 text-zinc-300 font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all border border-white/5 backdrop-blur-md"
          >
            <Save className="w-5 h-5" />
            GERENCIAR SAVES
          </button>
        </div>
      )}

      {view === 'load' && (
        <div className="w-full space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setView('main')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold">Saves Disponíveis</h2>
            <button onClick={() => setView('import')} className="ml-auto p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors flex items-center gap-2 text-sm font-bold">
              <Upload className="w-4 h-4" /> Importar
            </button>
          </div>

          {saves.length === 0 ? (
            <div className="text-center p-8 bg-black/20 rounded-2xl border border-white/5 text-zinc-500">
              Nenhum save encontrado.
            </div>
          ) : (
            <div className="space-y-3">
              {saves.map(save => (
                <div key={save.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 backdrop-blur-md">
                  <div 
                    className="flex-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-lg p-2 -m-2" 
                    onClick={() => handleLoad(save.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleLoad(save.id);
                      }
                    }}
                  >
                    <h3 className="font-bold text-lg text-white">{save.playerName || 'Jogador Desconhecido'}</h3>
                    <div className="flex items-center gap-3 text-xs font-bold text-zinc-400 mt-1 uppercase tracking-wider">
                      <span>{save.clubName}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span>Idade: {save.age}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span>Ano: {save.season}</span>
                    </div>
                    <div className="text-[10px] text-zinc-600 mt-2">
                      Atualizado em: {new Date(save.lastUpdated).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleExport(save.id)}
                      className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-300 transition-colors"
                      title="Exportar Save"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    
                    {deleteConfirm === save.id ? (
                      <div className="flex items-center gap-2 animate-in fade-in">
                        <button 
                          onClick={() => handleDelete(save.id)}
                          className="px-4 py-3 bg-red-500/20 hover:bg-red-500/40 text-red-400 font-bold rounded-xl text-sm transition-colors"
                        >
                          CONFIRMAR
                        </button>
                        <button 
                          onClick={() => setDeleteConfirm(null)}
                          className="px-4 py-3 bg-white/5 hover:bg-white/10 font-bold rounded-xl text-sm transition-colors"
                        >
                          CANCELAR
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setDeleteConfirm(save.id)}
                        className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view === 'import' && (
        <div className="w-full space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setView('load')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold">Importar Save</h2>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-6">
            <div>
              <p className="text-sm text-zinc-400 mb-3">Selecione um arquivo .json exportado anteriormente.</p>
              <input 
                type="file" 
                accept=".json"
                ref={fileInputRef}
                onChange={handleImportFile}
                className="hidden"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-white/10 hover:bg-white/15 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors border border-white/10"
              >
                <Upload className="w-4 h-4" /> ESCOLHER ARQUIVO
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-xs font-bold text-zinc-500">OU COLE O TEXTO</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            <div className="space-y-3">
              <textarea
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder="Cole o JSON do save aqui..."
                className="w-full h-32 bg-black/50 border border-white/10 rounded-xl p-4 text-sm font-mono text-zinc-300 resize-none focus:outline-none focus:border-yellow-500/50"
              />
              <button 
                onClick={handleImportText}
                disabled={!importJson.trim()}
                className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed font-bold py-3 px-6 rounded-xl transition-colors border border-yellow-500/30"
              >
                IMPORTAR TEXTO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
