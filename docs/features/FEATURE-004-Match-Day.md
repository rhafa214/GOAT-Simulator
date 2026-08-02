# FEATURE-004: Experiência de Match Day e Apresentação de Partidas — GOAT Simulator

## 1. Análise Técnica Completa
A experiência de **Match Day** é o momento de clímax antes da simulação de cada partida no **GOAT Simulator**. A arquitetura conecta os seletores do estado global (`useNextMatch`, `usePlayer`, `useCareer`), o motor de simulação determinístico (`MatchEngine` / `useSimulation`) e um painel de transmissão estilizado estilo TV.

### Requisitos Principais:
- **Integração sem Controle Direto de Gameplay:** O usuário visualiza as prévias táticas, forma física, objetivos e o contexto dramático da partida, acionando a simulação do `MatchEngine` sem necessidade de gameplay manual.
- **Detecção de Partidas Especiais vs. Partidas Comuns:**
  - Partidas importantes acionam a **Apresentação Especial (Especial Broadcast)**.
  - Partidas regulares acionam a **Apresentação Compacta (Compact View)** com opção de expandir para o modo completo.
- **Critérios para Apresentação Especial (`isImportantMatch = true`):**
  1. **Estreia:** Primeira partida da carreira ou estreia no novo clube.
  2. **Clássico:** Rivalidades regionais/nacionais (`importance === 'DERBY'`).
  3. **Mata-mata:** Rodadas eliminatórias (Oitavas, Quartas).
  4. **Semifinal:** Partidas de semifinal de copas/torneios.
  5. **Final:** Finais de qualquer competição (`importance === 'FINAL'`).
  6. **Disputa de Título:** Jogos decisivos no topo da tabela.
  7. **Jogo contra Ex-Clube:** Reencontro com clube anterior do histórico do jogador.
  8. **Seleção:** Partidas internacionais pela seleção nacional.
  9. **Copa do Mundo:** Torneio de maior prestígio do futebol mundial.
  10. **Recorde Histórico:** Jogos em que o atleta está prestes a quebrar marcas de gols/jogos.

---

## 2. Game Design Document (GDD)

### Objetivos do Jogador
- Sentir a imersão e a pressão pré-jogo através de um painel gráfico no estilo de transmissão de TV.
- Analisar os objetivos táticos atribuídos pelo treinador antes de entrar em campo.
- Acompanhar seu estado de forma física, moral e os possíveis recordes a serem quebrados.

### Mecânicas de Jogo
- **Painel de Transmissão TV:** Banner de topo estilizado com canal de transmissão fictício ("GOAT SPORTS LIVE"), horário local e dados do estádio.
- **Pitch Tático / Escalação:** Visualização do gramado estilizado com a posição do jogador em destaque.
- **Cartão de Objetivos:** Metas específicas para o jogo (ex: "Nota 7.5+", "1 Gol ou Assistência").
- **Histórico Recente:** Forma dos últimos 5 jogos da equipe (V, E, D).
- **Simulação com 1 Clique:** Botão "Simular Partida" que aciona a execução do motor e redireciona para a tela de pós-jogo (`POST_MATCH`).

---

## 3. Arquitetura do Sistema

```
[UI Component: MatchDayScreen]
       │
       ├── Helper: matchContextDetector.ts (calcula se a partida é especial e gera objetivos/recordes)
       ├── Componentes: MatchBroadcastBanner, TacticalPitch, MatchObjectivesCard, CompactMatchView
       │
       ▼
[MatchEngine / useSimulation]
       │
       ├── simulateMatch(params, seededRNG)
       └── dispatch({ type: 'ADD_MATCH_RESULT', payload: result }) ──► [PostMatchScreen]
```

---

## 4. Modelagem de Dados (Match Day Context)

```typescript
export interface MatchDayContext {
  isImportant: boolean;
  triggers: {
    isDebut: boolean;
    isDerby: boolean;
    isKnockout: boolean;
    isSemiFinal: boolean;
    isFinal: boolean;
    isTitleDecider: boolean;
    isExClub: boolean;
    isNationalTeam: boolean;
    isWorldCup: boolean;
    hasPotentialRecord: boolean;
  };
  stadiumName: string;
  narrativeSummary: string;
  objectives: Array<{
    id: string;
    description: string;
    rewardFame?: number;
    rewardMorale?: number;
  }>;
  potentialRecords: string[];
}
```

---

## 5. Descrição de Telas & Layout Responsivo

### Apresentação Especial (Broadcast Mode):
- **Topo:** Estádio com iluminação neon, refletores estilizados e placar de transmissão de TV.
- **Centro (Grid Responsiva):**
  - **Coluna Esquerda:** Escudos dos clubes, estatísticas do confronto e histórico recente de forma.
  - **Coluna Central:** Gramado estilizado em vetor com a posição do jogador iluminada e avatar do atleta.
  - **Coluna Direita:** Objetivos da partida, forma física (Fitness), moral e recordes potenciais.
- **Rodapé:** Botão destacado "Simular Partida (Entrar em Campo)".

### Apresentação Compacta (Compact View):
- Card horizontal responsivo com informações essenciais da partida e botões rápidos "Ver Detalhes Pré-Jogo" ou "Simular Direto".

---

## 6. Descrição dos Componentes

1. `MatchDayScreen.tsx`: Tela principal do Match Day, integrando os modos compacto e broadcast.
2. `MatchBroadcastBanner.tsx`: Topo no estilo de transmissão de TV com holofotes de estádio e informações da competição.
3. `TacticalPitch.tsx`: Gramado estilizado em 2D/3D com a escalação da equipe e indicador do jogador.
4. `MatchObjectivesCard.tsx`: Painel de metas e objetivos da partida.
5. `CompactMatchView.tsx`: Versão resumida para partidas comuns de liga.

---

## 7. Design System (Aesthetic GOAT)

- **Cores & Tema:** Iluminação de estádio com azul noturno, dourado neon e holofotes brancos.
- **Gramado:** Gradiente radial verde neon com linhas táticas vetorizadas.
- **Tipografia:** `Plus Jakarta Sans` para números/dados e `Playfair Display` para títulos da competição.

---

## 8. Análise de Trade-offs

| Solução Considerada | Vantagens | Desvantagens | Decisão |
| :--- | :--- | :--- | :--- |
| **A: Forçar a tela cheia de transmissão em TODAS as partidas** | Máxima imersão em 100% dos jogos. | Torna partidas comuns de meio de tabela repetitivas e mais lentas. | **Rejeitado.** Adotada versão compacta para jogos normais e especial para grandes jogos. |
| **B: Gameplay manual com controle do jogador** | Experiência de jogo de ação. | Foge do escopo de simulator/manager textual-estratégico do GOAT Simulator. | **Rejeitado.** Mantida simulação via `MatchEngine` sem controle direto. |
| **C: Fotografias hiper-realistas de estádios reais** | Aparência de jogo AAA comercial. | Riscos de imagem/direitos e quebra da identidade vetorial do GOAT. | **Rejeitado.** Adotado gramado e estádio estilizados com gráficos vetoriais e neon. |
