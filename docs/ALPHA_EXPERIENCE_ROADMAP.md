# ALPHA EXPERIENCE ROADMAP — GOAT Simulator

Este documento estabelece o plano diretor para a fase **GOAT Simulator Alpha Experience**. O objetivo desta fase é transformar o projeto de um sistema funcional com motores consolidados em uma **experiência visual imersiva, clara, emocionante e memorável**, sem alterar o gameplay, as regras de negócio ou a integridade dos motores subjacentes.

---

## 1. Diagnóstico Atual da Experiência

Auditoria detalhada da interface e usabilidade cobrindo as **16 áreas funcionais** sob a ótica dos **11 critérios de experiência**:

| Área | Clareza | Hierarquia Visual | Quantidade de Informação | Identidade | Responsividade | Feedback | Animações | Acessibilidade | Emoção | Repetição | Consistência DS |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **1. Menu Inicial** | Média | Média | Adequada | SaaS Generico | Alta | Baixo | Mínima | Adequada | Neutra | Baixa | Inconsistente (Blue/Indigo) |
| **2. Criação do Jogador** | Alta | Boa | Equilibrada | Faltam elementos de transmissão esportiva | Média (Formulário longo) | Moderado | Transições básicas | Baixa (Fontes pequenas) | Baixa | N/A | Parcial (Padrões de input variados) |
| **3. Draft (Rápido, Completo, Blind)** | Alta | Boa | Alta | Conceito excelente, falta impacto de escolha | Boa | Moderado (Card flip basico) | Modesta | Rótulos pequenos em mobile | Moderada | Moderada no Completo | Boa nos cards, ruim nos cabeçalhos |
| **4. Career Hub** | Média | Poluída | Excessiva em 1 coluna | Padrão Dashboard B2B | Média (Espremido em < 768px) | Baixo | Rígida | Baixa (Cinza escuro em preto) | Neutra | Alta (Interação semanal repetitiva) | Fragmentada (Várias opacidades) |
| **5. Navegação** | Média | Inversa | Poluída | Sidebar administrativa B2B | Baixa em mobile | Imediato | Sem micro-interações | Teclado básico | Ausente | Alta | Inconsistente (Botões ativos indigo) |
| **6. Dia de Jogo** | Alta | Média | Equilibrada | Falta atmosfera de arena / vestiário | Alta | Moderado | Barra de simulação estática | Boa | Baixa | Alta | Razoável |
| **7. Pós-Jogo** | Alta | Boa | Alta | Relatório estatístico frio | Média (Modal espremido) | Moderado | Números surgem secos | Razoável | Baixa (Sem clímax) | Alta | Média (Falta padrão Dourado) |
| **8. Transferências** | Média | Fraca | Alta | Sem clima de "Janela de Mercado" | Média (Modal estreito em 360px) | Moderado | Sem contagem/tensão | Baixa em mobile | Baixa | Baixa | Parcial |
| **9. Notícias** | Alta | Média | Baixa | Visual de feed genérico | Alta | Passivo | Nenhuma | Boa | Baixa | Alta | Desconectada do contexto do jogo |
| **10. Estatísticas** | Alta | Média | Altíssima | Tabela fria estilo Excel | Média (Rolagem interna obrigatoria) | Baixo | Nenhuma | Boa | Ausente | Baixa | Padrão técnico neutro |
| **11. Encerramento de Temporada** | Média | Transição abrupta | Acumulada | Falta retrospectiva jornalística | Boa | Moderado | Sem transição de época | Razoável | Baixa | Baixa | Fraca |
| **12. Títulos** | Média | Fraca | Baixa | Faltam troféus 3D/ilustrados expressivos | Boa | Estático | Sem confetes/celebracao | Boa | Baixa | Baixa | Ausente (Sem dourado exclusivo) |
| **13. Prêmios** | Média | Fraca | Baixa | Notificação textual simples | Boa | Passivo | Sem card de gala ou vinheta | Boa | Baixa | Baixa | Ausente |
| **14. Museu** | Boa | Média | Organizada | Boa estrutura, falta imponência histórica | Boa | Passivo | Entrada simples | Boa | Moderada | Baixa | Boa (Base para o novo DS) |
| **15. Aposentadoria** | Alta | Boa | Resumida | Respeitável, falta tom emotivo de encerramento | Boa | Estático | Sem rolar de créditos/legado | Boa | Moderada | N/A | Razoável |
| **16. Mobile (360px - 768px)** | Média | Espremida | Alta | Tende a achatar widgets | Crítica em modals estreitos | Adequado | Lags pontuais de canvas | Rótulos truncados | Neutra | N/A | Parcial |

---

## 2. Princípios da Experiência (UX & Emotion Design)

Para elevar o GOAT Simulator ao padrão Alpha, toda a interface será regida por **5 Princípios Inegociáveis**:

1. **O Jogador no Centro do Universo:** Todas as telas principais devem destacar a figura do atleta, seu Overall (`GER`), suas conquistas e seu estado físico/mental. O app não é um painel de controle; é o diário visual de um fenômeno.
2. **Atmosfera de Transmissão Esportiva (Broadcast Standard):** A tipografia, as cores, os grafismos oblíquos e os quadros de estatísticas devem evocar a estética de emissoras esportivas internacionais e de jogos AAA (EA Sports FC / NBA 2K).
3. **Celebração e Tensão Reais:** Conquistas, hat-tricks, bolas de ouro e títulos de campeão não podem ser apenas linhas de texto. Devem disparar estados visuais dedicados ("Gala Cards", brilho âmbar, overlays comemorativos e numeração em destaque).
4. **Fluidez e Micro-feedbacks:** Nenhuma ação deve ocorrer sem retorno sensorial instantâneo. Botões possuem estados de carregamento ativos, seleções geram pulsos de luz e alterações de estatísticas animam os valores (count-up de números).
5. **Zero Ruído Visual (Clareza em Múltiplas Telas):** Telas menores (360px - 390px) recebem layouts com prioridade vertical estrita, utilizando abas inferiores (Bottom Nav Bar) e modais expansíveis com área de toque mínima de 44px.

---

## 3. Identidade Visual Definitiva (GOAT Gold & Pitch Black)

A identidade unificada da versão Alpha erradica os tons azulados/indigo genéricos de SaaS, adotando uma paleta e estéticas consagradas no documento `25_Visual_Identity_V2.md`.

### 3.1. Paleta de Cores Definitiva
* **Canvas Absoluto (Fundo):** `#000000` (`bg-black`). Profundidade imersiva, alto contraste e economia energética.
* **Superfícies de Vidro Escuro (Panéis/Cards):**
  * Card Base: `bg-zinc-950/80 border border-zinc-800/80`
  * Card Elevado/Ativo: `bg-zinc-900/90 border border-zinc-700/80`
* **Destaque Primário (GOAT Gold):**
  * Principal/Botões de Ação: `bg-amber-500 hover:bg-amber-400 text-black font-bold` (`#F59E0B`)
  * Texto e Acentos: `text-amber-400` / `border-amber-500/50`
* **Cores Semânticas de Futebol:**
  * Performance/Positivo: `text-emerald-400` (`#34D399`)
  * Fadiga/Aviso/Derrota: `text-rose-500` (`#F43F5E`)
  * Informação Tática/Empate: `text-sky-400` (`#38BDF8`)
* **Texto e Hierarquia:**
  * Primário: `text-zinc-100` (Branco Puro / Off-white)
  * Secundário: `text-zinc-400` (Cinza Mineral)
  * Terciário/Rótulos: `text-zinc-500`

### 3.2. Tipografia e Ritmo
* **Display / Números / Headers:** Fonte condensada geométrica (`Bebas Neue` / `Oswald` fallback system `font-mono track-wider uppercase`).
* **Corpo e Atributos:** `Plus Jakarta Sans` ou `Inter` (`font-sans`).
* **Tamanhos Limite:** Proibido uso de fontes abaixo de `12px` (`text-xs`). Substituir `text-[10px]` por `text-xs text-zinc-400`.

### 3.3. Geometria e Superfícies
* **Border Radius:** `rounded-2xl` para cards principais; `rounded-lg` para sub-elementos; `rounded-full` para badges e pílulas de status.
* **Sombras:** Eliminar glows difusos exagerados. Usar `shadow-2xl` suave com `ring-1 ring-white/10`.

---

## 4. Telas Prioritárias da Reformulação

1. **Career Hub (`MainHub.tsx` & `DashboardView.tsx`):** Substituição da barra lateral B2B por um Header/Bottom Navigation Bar de revista esportiva, trazendo o Avatar 3D e o Card de Status para o centro visual.
2. **Post Match Screen (`PostMatchScreen.tsx`):** Transformação da tela pós-jogo em um "Match Report Digest" com animação de notas, destaques da rodada e avaliação de imprensa.
3. **Draft Selection (`DraftView.tsx`):** Aprimoramento visual dos cards de ídolos, efeito de "revelação lendária" e feedback tático imediato.
4. **Gala de Prêmios e Títulos (Museum & Season Finish):** Criação da vinheta de entrega de prêmios (Bola de Ouro, Chuteira de Ouro) com placas comemorativas.
5. **Mercado de Transferências (`TransferOfferModal.tsx` & Hub):** Redesenho da interface de propostas com clima de "Deadline Day", incluindo medidor de paciência da diretoria e estresse financeiro.

---

## 5. Componentes Compartilhados (Design System Core)

Será criada a pasta `src/components/ui/goat/` contendo componentes base padronizados:

* `<GoatCard>`: Container de vidro escuro com borda mineral e opções de destaque âmbar.
* `<GoatButton>`: Botão tátil com estados de hover, active, loading e cores padronizadas (Primary Gold, Secondary Mineral, Danger Rose).
* `<GoatBadge>`: Pílula de status (Vitória, Derrota, Lesão, Transferência, Nível de Raridade).
* `<GoatStatHeader>`: Bloco tipográfico padronizado para Overalls, Salários e Estatísticas.
* `<GoatModal>`: Modal responsivo ajustado para mobile (área de toque 44px+, rolagem fluida e suporte a ESC/backdrop click).
* `<GoatNumberCounter>`: Animação fluida de contagem crescente para pontuações e dinheiros.

---

## 6. Roadmap Dividido em Sprints

### Sprint 1: Fundação do Design System GOAT & Estrutura do Hub
* Implementação dos componentes base em `src/components/ui/goat/`.
* Refatoração da estrutura de navegação do `MainHub.tsx`: remoção da sidebar B2B e introdução da navegação esportiva (Header + Bottom Nav para mobile).
* Aplicação da nova paleta de cores (Preto Absoluto `#000000` + Dourado Âmbar `#F59E0B`).

### Sprint 2: Redesenho do Menu Inicial, Criação do Jogador e Draft
* Modernização do `MainMenu.tsx` com iluminação de estúdio e atalhos rápidos.
* Reformulação da tela de criação de jogador e avatar 3D com moldura de cartão profissional.
* Ajustes nos cards do Draft (Quick, Complete, Blind) com animações de seleção e efeito "Lendário".

### Sprint 3: Experiência de Jogo (Dia de Jogo, Pós-Jogo e Notícias)
* Criação do "Match Day Hub" com atmosfera de vestiário e comparação tática de equipes.
* Redesenho da `PostMatchScreen` em estilo "Transmissão da Rodada" (Match Digest, Nota do Atleta, Avaliação da Torcida).
* Atualização do feed de notícias com diagramação de portal esportivo real.

### Sprint 4: Janela de Transferências, Encerramento e Gala de Prêmios
* Redesenho do `TransferOfferModal` e do hub de propostas com medidor de paciência e clima de Deadline Day.
* Criação da vinheta de encerramento da temporada e telas de Gala para Bola de Ouro / TOTY.
* Refatoração do Museu e Hall da Fama para visual imponente de galeria de troféus.

---

## 7. Critérios de Aceitação

Para considerar a fase Alpha concluída com sucesso:
1. **Zero Erros / Zero Linter Failures:** A aplicação deve manter 100% dos 146 testes automatizados passando e zero avisos de compilação/linter.
2. **Consistência Estética Total:** Nenhuma tela deve apresentar a cor `indigo-600` ou fundos azulados `#05050A`. Todos os cartões utilizam o padrão mineral e âmbar.
3. **Responsividade Mobile Impecável:** 100% das telas e modais devem ser operáveis em 360px sem estouro horizontal, cortes de texto ou botões inacessíveis.
4. **Foco e Acessibilidade:** Navegação por teclado (Tab/Enter/Space) e leitores de tela mantidos funcionais em todos os componentes reescritos.

---

## 8. Análise de Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| **Quebra de testes ao refatorar estruturas DOM** | Alto | Não alterar seletores táticos cruciais nem props de eventos do reducer; manter IDs e papéis de acessibilidade. |
| **Queda de desempenho no mobile por excesso de animações** | Médio | Usar animações baseadas em CSS puro (`transform` e `opacity`) e limitar chamadas do Framer Motion a componentes visíveis. |
| **Aumento da complexidade de manutenção do estado do Hub** | Médio | Manter a lógica do reducer intacta em `src/core/state/reducers/`, isolando refatorações estritamente no nível da apresentação (`src/components/`). |

---

## 9. Funcionalidades e Motores que NÃO Devem Ser Alterados

Conforme diretriz estrita da etapa, as seguintes camadas lógicas são **100% intocáveis**:

1. **Engine de Partida (`matchEngine.ts`, `simulationEngine.ts`):** Probabilidades, notas de simulação e geração de gols.
2. **Engine de Temporada (`seasonEngine.ts`, `advanceWeek.ts`):** Tabela de classificação, pontos, saldo de gols e calendário Berger.
3. **Engine de Transferências (`transferEngine.ts`):** Fórmulas de cálculo de valor de mercado, propostas e aceitação por IA.
4. **Engine de Progressão e Legado (`progressionEngine.ts`, `legacyEngine.ts`):** Cálculo de atributos, fadiga, evolução por idade e pontuação GOAT.
5. **Sistema de Saves (`saveSystem.ts`):** Serialização JSON, esquemas de versão, validação de payload e LocalStorage.

---

## 10. Ordem Recomendada de Implementação

1. **Criação da documentação** `docs/ALPHA_EXPERIENCE_ROADMAP.md` (Etapa atual).
2. **Criação do pacote de componentes UI base** (`src/components/ui/goat/`).
3. **Refatoração do Layout Principal (`MainHub.tsx`)** eliminando a sidebar B2B.
4. **Atualização do Dashboard e Ficha do Jogador**.
5. **Reformulação das telas de Draft e Criação de Personagem**.
6. **Aprimoramento da experiência de Partida e Pós-Jogo**.
7. **Refatoração das Transferências e Gala de Prêmios/Museu**.
8. **Validação e auditoria final em 6 resoluções e 3 navegadores**.

---
*Documento aprovado e estabelecido como guia oficial da fase GOAT Simulator Alpha Experience.*
