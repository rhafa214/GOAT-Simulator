import React, { useState } from 'react';
import { useGameState } from '../../../engine/selectors';
import { useGameEngine } from '../../../engine/GameEngine';
import { TransferProposal } from '../../../types';
import { TransferEngine } from '../../../core/domain/transferEngine';
import { ALL_CLUBS } from '../../../data/database';

export default function TransferHub() {
  const { state, dispatch } = useGameEngine();
  const transferState = state.career.transferState;
  const activeProposals = transferState?.activeProposals?.filter(p => p.status === 'generated' || p.status === 'presented' || p.status === 'negotiating') || [];
  
  const [selectedProposal, setSelectedProposal] = useState<TransferProposal | null>(activeProposals[0] || null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const currentClub = state.career.currentClub;
  const currentContract = state.career.contract;
  
  const handleAccept = (proposal: TransferProposal) => {
    const engine = new TransferEngine();
    const newState = engine.acceptProposal(state, proposal.id);
    newState.phase = 'HUB';
    dispatch({ type: 'SET_STATE', payload: newState });
  };

  const handleReject = (proposal: TransferProposal) => {
    const engine = new TransferEngine();
    const newState = engine.rejectProposal(state, proposal.id);
    
    // Check if there are other active proposals
    const remaining = newState.career.transferState?.activeProposals.filter(p => p.status === 'generated' || p.status === 'presented' || p.status === 'negotiating') || [];
    
    if (remaining.length === 0) {
      newState.phase = 'HUB';
    }
    
    dispatch({ type: 'SET_STATE', payload: newState });
    if (remaining.length > 0) {
       setSelectedProposal(remaining[0]);
    }
  };

  const handleNegotiate = (proposal: TransferProposal, action: 'demand_more_salary' | 'demand_shorter_duration' | 'demand_longer_duration') => {
    const engine = new TransferEngine(Math.random());
    // Agent skill from state, or default 50
    const agentSkill = state.career.agent?.negotiationSkill || 50;
    
    const negotiated = engine.negotiateProposal(proposal, action, agentSkill);
    
    const newState = { ...state };
    if (newState.career.transferState) {
       const index = newState.career.transferState.activeProposals.findIndex(p => p.id === proposal.id);
       if (index !== -1) {
          newState.career.transferState.activeProposals[index] = negotiated;
       }
    }
    
    if (negotiated.status === 'withdrawn') {
       setFeedbackMsg('O clube encerrou as negociações!');
       setTimeout(() => handleReject(proposal), 2000);
    } else {
       setFeedbackMsg('O clube aceitou suas exigências!');
       setSelectedProposal(negotiated);
    }
    
    dispatch({ type: 'SET_STATE', payload: newState });
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  if (activeProposals.length === 0) {
     return (
        <div className="w-full max-w-4xl flex flex-col items-center justify-center p-8 bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-white/5">
           <h2 className="text-2xl font-bold text-white mb-4">Sem propostas ativas</h2>
           <button onClick={() => dispatch({ type: 'SET_STATE', payload: { ...state, phase: 'HUB' } })} className="px-6 py-3 bg-white text-black font-bold rounded-xl">Voltar ao Hub</button>
        </div>
     );
  }

  const targetClub = selectedProposal ? ALL_CLUBS.find(c => c.id === selectedProposal.clubId) : null;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch({ type: 'SET_STATE', payload: { ...state, phase: 'HUB' } })}
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-amber-400 hover:bg-zinc-800 rounded-xl text-xs font-bold transition-colors"
          >
            ← Voltar ao Hub
          </button>
          <h2 className="text-3xl font-black text-white tracking-tight">Mercado de Transferências</h2>
        </div>
        <span className="px-4 py-1.5 bg-yellow-500/10 text-yellow-500 rounded-full text-sm font-bold border border-yellow-500/20">
          {activeProposals.length} Oferta(s)
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="flex flex-col gap-3">
          {activeProposals.map(prop => {
            const club = ALL_CLUBS.find(c => c.id === prop.clubId);
            const isSelected = selectedProposal?.id === prop.id;
            return (
              <button
                key={prop.id}
                onClick={() => setSelectedProposal(prop)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected 
                    ? 'bg-white/10 border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.1)]' 
                    : 'bg-black/40 border-white/5 hover:bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">{club?.name}</span>
                  <span className="text-xs font-bold px-2 py-1 bg-zinc-800 rounded-md text-zinc-300">
                    Rodada {prop.negotiationRounds}/3
                  </span>
                </div>
                <div className="text-sm text-zinc-400">
                  Salário: €{(prop.offerSalary || 0).toLocaleString()}/sem
                </div>
              </button>
            );
          })}
        </div>

        {/* Main View */}
        {selectedProposal && targetClub && (
          <div className="lg:col-span-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col gap-8 relative overflow-hidden">
             
            {feedbackMsg && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-6 py-2 rounded-full font-bold shadow-lg z-10 animate-bounce">
                {feedbackMsg}
              </div>
            )}

            <div className="grid grid-cols-2 gap-8 text-center relative">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-3/4 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
               
               {/* Current Club */}
               <div className="flex flex-col items-center gap-4">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Clube Atual</span>
                  {currentClub ? (
                    <>
                      <div className="w-24 h-24 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center p-4">
                        {currentClub.logo ? <img src={currentClub.logo} alt="" className="max-w-full max-h-full object-contain opacity-80" /> : <span className="font-black text-2xl text-white/20">{currentClub.name.charAt(0)}</span>}
                      </div>
                      <h3 className="text-xl font-bold text-white/80">{currentClub.name}</h3>
                      <div className="flex flex-col gap-2 w-full mt-4 bg-black/20 rounded-xl p-4 border border-white/5">
                        <div className="flex justify-between text-sm">
                           <span className="text-zinc-500">Reputação</span>
                           <span className="font-bold text-white/70">{currentClub.reputation}/100</span>
                        </div>
                        <div className="flex justify-between text-sm">
                           <span className="text-zinc-500">Salário</span>
                           <span className="font-bold text-white/70">€{(currentContract?.salary || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                           <span className="text-zinc-500">Contrato até</span>
                           <span className="font-bold text-white/70">{currentContract?.expirationYear}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-zinc-500 font-bold">Sem Clube</div>
                  )}
               </div>

               {/* Target Club */}
               <div className="flex flex-col items-center gap-4">
                  <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest">Interessado</span>
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center p-4 shadow-[0_0_30px_rgba(234,179,8,0.15)] relative">
                     {targetClub.logo ? <img src={targetClub.logo} alt="" className="max-w-full max-h-full object-contain" /> : <span className="font-black text-2xl text-yellow-500">{targetClub.name.charAt(0)}</span>}
                     <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black text-xs font-black px-2 py-0.5 rounded-md">NEW</div>
                  </div>
                  <h3 className="text-xl font-bold text-white">{targetClub.name}</h3>
                  <div className="flex flex-col gap-2 w-full mt-4 bg-yellow-500/5 rounded-xl p-4 border border-yellow-500/10">
                    <div className="flex justify-between text-sm">
                       <span className="text-zinc-500">Reputação</span>
                       <span className="font-bold text-yellow-500">{targetClub.reputation}/100</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-zinc-500">Oferta Salarial</span>
                       <span className="font-bold text-green-400">€{(selectedProposal.offerSalary || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-zinc-500">Duração</span>
                       <span className="font-bold text-white">{selectedProposal.offerDuration} Anos</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-zinc-500">Função</span>
                       <span className="font-bold text-white">{selectedProposal.expectedRole}</span>
                    </div>
                  </div>
               </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mt-auto">
               <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => handleAccept(selectedProposal)} className="py-4 bg-white text-black font-black rounded-xl hover:bg-zinc-200 transition-colors">
                    Aceitar Proposta
                 </button>
                 <button onClick={() => handleReject(selectedProposal)} className="py-4 bg-zinc-900 text-white border border-white/10 font-bold rounded-xl hover:bg-zinc-800 transition-colors">
                    Recusar
                 </button>
               </div>
               
               {selectedProposal.negotiationRounds < 3 ? (
                 <div className="flex gap-2">
                    <button onClick={() => handleNegotiate(selectedProposal, 'demand_more_salary')} className="flex-1 py-3 bg-zinc-800 text-zinc-300 text-sm font-bold rounded-xl hover:bg-zinc-700 transition-colors">
                       Pedir + Salário
                    </button>
                    <button onClick={() => handleNegotiate(selectedProposal, 'demand_shorter_duration')} className="flex-1 py-3 bg-zinc-800 text-zinc-300 text-sm font-bold rounded-xl hover:bg-zinc-700 transition-colors">
                       Menos Tempo
                    </button>
                    <button onClick={() => handleNegotiate(selectedProposal, 'demand_longer_duration')} className="flex-1 py-3 bg-zinc-800 text-zinc-300 text-sm font-bold rounded-xl hover:bg-zinc-700 transition-colors">
                       Mais Tempo
                    </button>
                 </div>
               ) : (
                 <div className="text-center text-sm font-bold text-red-400 bg-red-500/10 py-3 rounded-xl">
                   Limite de negociações atingido. Aceite ou recuse.
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
