import React from 'react';
import { DraftRound } from '../../types';
import { X, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';

interface DraftReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  rounds: DraftRound[];
}

export const DraftReviewModal: React.FC<DraftReviewModalProps> = ({
  isOpen,
  onClose,
  rounds
}) => {
  if (!isOpen) return null;

  const completedRounds = rounds.filter((r) => r.selectedOptionId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 relative max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Trophy className="text-amber-400" size={20} />
            <h3 className="text-lg font-black text-white uppercase tracking-wider">
              Histórico de Escolhas do Draft
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* List of completed rounds */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {completedRounds.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 font-bold text-sm">
              Nenhuma escolha concluída ainda.
            </div>
          ) : (
            completedRounds.map((round, index) => {
              const selectedOpt = round.options.find(
                (o) => o.idolId === round.selectedOptionId
              );
              if (!selectedOpt) return null;

              return (
                <div
                  key={`${round.attributeId}-${index}`}
                  className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-xs">
                      #{index + 1}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-zinc-400 block">
                        Atributo: {round.attributeId}
                      </span>
                      <h4 className="text-sm font-black text-white">
                        {selectedOpt.name}
                      </h4>
                      <span className="text-[11px] font-bold text-zinc-400">
                        {selectedOpt.nationality} • {selectedOpt.positionOrEra}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black text-amber-400 block">
                      {selectedOpt.currentBonus[round.attributeId]}
                    </span>
                    {selectedOpt.dna && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/40 text-[10px] font-bold text-purple-300">
                        <Sparkles size={10} />
                        <span>{selectedOpt.dna.name}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-zinc-800 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all"
          >
            Fechar (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
