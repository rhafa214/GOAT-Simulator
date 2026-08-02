# FEATURE-001: Experiência Central do Draft e Sistema de Player DNA — GOAT Simulator

## 1. Análise Técnica Completa
O Draft é a espinha dorsal da criação de personagem e formação de identidade no **GOAT Simulator**. A arquitetura conecta o `DraftEngine` (deterministico com SeededRNG) à interface reativa do React, garantindo integridade das regras, rastreabilidade de decisões e ausência de efeitos colaterais indesejados (como confirmações acidentais por simples clique).

### Requisitos Principais:
- **Preservação das Regras do Engine:** Utilização estrita das fórmulas e do gerador do `DraftEngine` (`src/core/domain/draftEngine.ts`).
- **Modos de Draft:**
  1. **Draft Rápido (`QUICK`):** 8 rodadas focadas nas métricas primárias (PAC, SHO, PAS, DRI, DEF, PHY, SM, WF).
  2. **Draft Completo (`COMPLETE`):** 16–20 rodadas detalhadas abrangendo sub-atributos técnicos, físicos e mentais.
  3. **Draft Aberto (`OPEN`):** Os valores numéricos dos atributos ficam abertos e visíveis desde o início da rodada.
  4. **Blind Draft (`BLIND`):** Nome, foto/retrato, nacionalidade e posição visíveis, porém o valor do atributo é exibido como `???` até a seleção/revelação após a confirmação.
- **Fluxo do Draft (12 Passos Decisivos):**
  1. Introdução curta da rodada / contexto.
  2. Apresentação da Categoria Atual (ex: Finalização, Drible, etc.).
  3. Entrada das Cartas (fechadas/ocultas no modo Blind, abertas no modo Aberto).
  4. Revelação Progressiva com controle de velocidade / animação.
  5. Análise Livre: Todas as opções permanecem disponíveis na tela para comparação pelo usuário.
  6. Destaque do Atributo Relevante na carta inspecionada.
  7. Confirmação Manual: Nenhuma escolha ocorre automaticamente por simples clique na carta; exige um botão explícito de "Confirmar Escolha" (ou tecla `Enter`/`Espaço`).
  8. Revelação no Blind Draft (revela o valor numérico exato e raridade ao confirmar).
  9. Aplicação do Player DNA acumulado (traits, tendências e modificadores do ídolo).
  10. Atualização Instantânea da Ficha do Jogador no Painel Fixo.
  11. Transição Suave para a Próxima Rodada.
  12. Apresentação Final (Resumo de OVR, Estilo de Jogo, DNA Total e Botão para Próxima Fase).

---

## 2. Game Design Document (GDD)

### Objetivos do Jogador
- Experimentar a tensão e a nostalgia do futebol ao "absorver" atributos e DNA de grandes nomes da história futebolística.
- Montar um perfil posicional único (ex: Atacante veloz com DNA de Ronaldinho Gaúcho e passe de Pirlo).

### Mecânicas de Jogo
- **Inspeção de Carta:** Clicar numa carta foca o card e destaca as características do ídolo sem selecionar permanentemente.
- **Botão de Confirmação:** O usuário visualiza o botão "Confirmar Escolha [NOME DO ÍDOLO]" antes de bater o martelo.
- **Player DNA:** Atributos de raridade GOAT, Lendária e Épica trazem traços de DNA (ex: *Finesse Shot*, *Outside Foot*, *Clutch Finisher*).
- **Controle do Tempo:** O usuário pode alternar a velocidade das animações (1x, 2x, Instantâneo) e ativar/desativar o modo de redução de movimento (`prefers-reduced-motion`).
- **Revisão de Escolhas:** A qualquer momento, o usuário pode abrir o painel "Revisar Escolhas" para visualizar o histórico de rodadas anteriores.

---

## 3. Arquitetura do Sistema

```
[UI Component: DraftExperience]
       │
       ├── State Local: inspectIndex, isRevealed, animationSpeed, isReviewOpen
       ├── Keyboard Controls: Arrow Keys (1-5), Enter/Space, Speed Toggle (A)
       │
       ▼
[GameEngine / DraftEngine] ──(SeededRNG)──► [IDOLS Database]
       │
       ├── initializeDraft(mode, seed)
       ├── selectOption(state, idolId)
       └── applyToTechnicalStats(state)
```

---

## 4. Modelagem de Banco de Dados & Estado Global

```typescript
export type DraftVisibility = 'OPEN' | 'BLIND';
export type DraftLength = 'QUICK' | 'COMPLETE';

export interface DraftOption {
  idolId: string;
  name: string;
  nationality: string;
  positionOrEra: string;
  photoUrl?: string;
  attributeValue: number;
  dna?: PlayerDNA;
}

export interface DraftState {
  mode: DraftLength;
  visibility: DraftVisibility;
  seed: number;
  currentRoundIndex: number;
  rounds: DraftRound[];
  acquiredDNA: PlayerDNA[];
  usedIdols: string[];
}
```

---

## 5. Descrição de Telas & Layout Responsivo

### Painel Principal (Draft Stage):
- **Topo:** Barra de progresso da rodada (ex: `03/08`), seletor de velocidade (`1x`, `2x`, `Instantâneo`), chave de visibilidade (`Aberto` vs `Blind`) e botão "Revisar Escolhas (`R`)".
- **Centro:** Categoria atual em grande destaque (ex: `DRIBLE (DRI)`), com o carrossel/grid de 5 cartas de ídolos.
- **Painel Fixo (Lateral / Bottom Sheet no Mobile):**
  - **Overall Estimado:** Círculo em destaque com o OVR calculated dinamicamente.
  - **Posição do Jogador:** Ex: `Atacante (ST)`.
  - **Atributos Escolhidos:** Lista de barras com valores atualizados.
  - **Player DNA Adquirido:** Badges dos DNAs coletados durante o draft.
  - **Botão de Revisão:** Acesso ao histórico completo de escolhas já feitas.

---

## 6. Descrição dos Componentes

1. `DraftExperience.tsx`: Componente principal que coordena os 12 passos do fluxo, escuta comandos de teclado e gerencia mobile responsiveness.
2. `DraftCard.tsx`: Card responsivo da opção de ídolo, suportando efeito 3D flip, acessibilidade por teclado, estado focado/inspecionado e renderização de atalhos.
3. `DraftFixedPanel.tsx`: Painel lateral fixo (ou bottom-sheet mobile) exibindo progresso, OVR estimado, lista de atributos acumulados e badges de DNA.
4. `DraftReviewModal.tsx`: Modal interativo para revisar todas as escolhas concluídas rodada por rodada.
5. `DraftSummaryView.tsx`: Apresentação final do draft com a ficha consolidada do jogador e botão para salvar o atleta e avançar para o clube.

---

## 7. Design System (Aesthetic GOAT)

- **Cores & Tema:** Paleta dark luxo com contrastes em dourado neon (`#EAB308`), azul ciano (`#06B6D4`) e roxo elétrico (`#D946EF`).
- **Cartas:** Estilo autoral sem cópia de propriedade alheia (EA FC).
- **Tipografia:** `Plus Jakarta Sans` para dados técnicos e `Playfair Display` para títulos principais.

---

## 8. Análise de Trade-offs

| Solução Considerada | Vantagens | Desvantagens | Decisão |
| :--- | :--- | :--- | :--- |
| **A: Confirmação Automática ao Clicar** | Requer 1 clique a menos do usuário. | Provoca escolhas acidentais por erro de clique no mobile ou ao comparar opções. | **Rejeitado.** Adotada confirmação explícita em botão separado. |
| **B: Animações Fixas sem Aceleração** | Mantém tempo uniforme de apresentação. | Pode parecer muito lento para jogadores experientes ou testes repetidos. | **Rejeitado.** Implementado toggle de velocidade (1x, 2x, Instantâneo) e suporte a reduced-motion. |
| **C: Painel Deslizante sem Acesso a Histórico** | Menos código e complexidade de UI. | Impede o jogador de lembrar o que escolheu nas primeiras rodadas. | **Rejeitado.** Adicionado o modal "Revisar Escolhas" no Painel Fixo. |
