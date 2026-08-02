import React, { useState } from 'react';
import { GoatCard } from './GoatCard';
import { GoatButton } from './GoatButton';
import { GoatBadge } from './GoatBadge';
import { GoatStatHeader } from './GoatStatHeader';
import { GoatModal } from './GoatModal';
import { GoatNumberCounter } from './GoatNumberCounter';

export const GoatShowcase: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [counterValue, setCounterValue] = useState(85);

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-8 bg-black text-zinc-100 font-goat-body rounded-2xl border border-zinc-800">
      <header className="border-b border-zinc-800 pb-4">
        <h1 className="font-goat-display text-4xl uppercase tracking-wider text-amber-400 goat-gold-text-glow">
          GOAT Design System — Visual Showcase
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Identidade Visual Definitiva (GOAT Gold & Pitch Black)
        </p>
      </header>

      {/* Badges Section */}
      <section className="space-y-3">
        <h2 className="font-goat-display text-2xl uppercase tracking-wide text-zinc-200">
          1. GoatBadges
        </h2>
        <div className="flex flex-wrap gap-3">
          <GoatBadge variant="gold">GOAT Gold</GoatBadge>
          <GoatBadge variant="victory">Vitória 3 x 0</GoatBadge>
          <GoatBadge variant="defeat">Derrota 1 x 2</GoatBadge>
          <GoatBadge variant="draw">Empate 0 x 0</GoatBadge>
          <GoatBadge variant="warning">Risco de Lesão</GoatBadge>
          <GoatBadge variant="info">Janela Aberta</GoatBadge>
          <GoatBadge variant="neutral">Reserva</GoatBadge>
          <GoatBadge variant="gold" oblique>
            Oblique Style
          </GoatBadge>
        </div>
      </section>

      {/* Buttons Section */}
      <section className="space-y-3">
        <h2 className="font-goat-display text-2xl uppercase tracking-wide text-zinc-200">
          2. GoatButtons
        </h2>
        <div className="flex flex-wrap gap-3 items-center">
          <GoatButton variant="primary" glow>
            Entrar em Campo
          </GoatButton>
          <GoatButton variant="secondary">Ver Estatísticas</GoatButton>
          <GoatButton variant="outline">Renovar Contrato</GoatButton>
          <GoatButton variant="danger">Recusar Proposta</GoatButton>
          <GoatButton variant="ghost">Voltar</GoatButton>
          <GoatButton variant="primary" isLoading>
            Carregando
          </GoatButton>
        </div>
      </section>

      {/* Stat Headers Section */}
      <section className="space-y-3">
        <h2 className="font-goat-display text-2xl uppercase tracking-wide text-zinc-200">
          3. GoatStatHeaders
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
          <GoatStatHeader label="Overall" value="92" highlight trend="up" trendValue="+3" size="lg" />
          <GoatStatHeader label="Gols na Temporada" value="28" trend="up" trendValue="+2" size="lg" />
          <GoatStatHeader label="Assistências" value="14" trend="neutral" size="lg" />
          <GoatStatHeader label="Avaliação Média" value="8.9" highlight trend="up" size="lg" />
        </div>
      </section>

      {/* Cards Section */}
      <section className="space-y-3">
        <h2 className="font-goat-display text-2xl uppercase tracking-wide text-zinc-200">
          4. GoatCards
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GoatCard variant="gold" obliqueHeader headerTitle="Carta Lendária" glow>
            <p className="text-sm text-zinc-300">
              Desempenho histórico na Champions League com 3 gols anotados na final.
            </p>
          </GoatCard>

          <GoatCard variant="victory" obliqueHeader headerTitle="Resultado Recente">
            <p className="text-sm text-zinc-300">
              Atuação perfeita com nota 9.5 e eleito Homem do Jogo.
            </p>
          </GoatCard>

          <GoatCard variant="default" interactive onClick={() => setIsModalOpen(true)}>
            <div className="flex flex-col items-center text-center space-y-2 py-2">
              <span className="text-amber-400 font-bold uppercase text-xs">Ação Interativa</span>
              <p className="text-sm font-semibold">Clique para testar o GoatModal</p>
            </div>
          </GoatCard>
        </div>
      </section>

      {/* Number Counter Section */}
      <section className="space-y-3">
        <h2 className="font-goat-display text-2xl uppercase tracking-wide text-zinc-200">
          5. GoatNumberCounter
        </h2>
        <div className="flex items-center gap-6 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
          <div>
            <span className="text-xs text-zinc-400 uppercase block font-bold">Salário Semanal</span>
            <GoatNumberCounter
              value={counterValue * 1000}
              formatCurrency
              className="text-3xl text-amber-400"
            />
          </div>
          <GoatButton
            size="sm"
            variant="secondary"
            onClick={() => setCounterValue((prev) => prev + 10)}
          >
            Aumentar Valor
          </GoatButton>
        </div>
      </section>

      {/* Modal Example */}
      <GoatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Proposta Irrecusável de Transferência"
        subtitle="Real Madrid de Espanha"
        footer={
          <>
            <GoatButton variant="ghost" onClick={() => setIsModalOpen(false)}>
              Negar
            </GoatButton>
            <GoatButton variant="primary" onClick={() => setIsModalOpen(false)}>
              Aceitar Contrato
            </GoatButton>
          </>
        }
      >
        <div className="space-y-4">
          <p>
            O clube espanhol ofereceu um contrato de 4 anos com salário de{' '}
            <strong className="text-amber-400">R$ 450.000 / semana</strong> e status de jogador chave no elenco.
          </p>
          <div className="grid grid-cols-2 gap-2 bg-zinc-900 p-3 rounded-lg border border-zinc-800 text-xs">
            <div>
              <span className="text-zinc-500 block">Multa Rescisória</span>
              <span className="text-zinc-200 font-bold">R$ 200M</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Prestígio Continental</span>
              <span className="text-amber-400 font-bold">Máximo ★★★★★</span>
            </div>
          </div>
        </div>
      </GoatModal>
    </div>
  );
};
