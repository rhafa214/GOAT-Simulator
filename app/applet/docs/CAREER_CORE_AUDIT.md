# SPRINT 1A — Relatório de Auditoria: Career Core (GOAT Simulator)

Este documento consolida os resultados da auditoria técnica da arquitetura, progressão e fluxo de dados do GOAT Simulator, baseado no código-fonte atual (sem suposições).

---

## 1. PROGRESSÃO E OVERALL

- **Definição do Overall (OVR) Inicial:** O Overall não é armazenado como uma variável estática persistida. Ele é calculado dinamicamente como a média aritmética dos 17 atributos técnicos.
- **Localização:** `src/engine/selectors.ts` (`useOverall()`) e `src/core/domain/transferEngine.ts` (`calculateOverall`).
- **Problema do OVR alto (17 anos com 75+ OVR e 99 de atributos):** A causa está no `src/core/domain/draftEngine.ts`. Ao escolher as características inspiradas em lendas (`src/data/idols.ts`), o sistema atribui os valores base dos ídolos com pequenas variações randômicas. Como as lendas têm status base entre 80 e 99, a média matemática das 17 escolhas já resulta num jogador extremamente desenvolvido logo no início da carreira.
- **Definição do Potencial:** É definido em `src/core/domain/progressionEngine.ts` (`initializeProgression`), usando uma pontuação base (derivada da média técnica + fator aleatório).
- **Influência da Idade:** Em `progressionEngine.ts` (`processWeek`), o crescimento é modulado pelo multiplicador de idade (`ageMult`). Se a idade é menor que o pico (`peakAge`), ele ganha 1.5x de XP; se está no pico, 0.8x; e se passou da idade de declínio, apenas 0.2x.
- **Evolução Semanal e Anual:** Na função `processWeek`, o jogador ganha XP (Match XP e Training XP). Este XP vai para `developmentPoints`. Ao bater 1000 XP num atributo, ele evolui +1 ponto.
- **Pico de Carreira e Declínio:** Existem. São definidos no início baseados na `growthCurve` (`EARLY_PEAK`, `NORMAL`, `LATE_BLOOMER`). O declínio acontece após a `declineAge` (ex: 30-33 anos), quando atributos podem decair baseados em probabilidade.
- **Limites e Risco:** Há um *hard cap* de 99. O risco atual é alto, pois ao começar perto de 99, o jogador atinge o teto imediatamente nas primeiras temporadas, invalidando toda a curva de XP, anulando o senso de crescimento.

---

## 2. SIMULAÇÃO E CALENDÁRIO

**Mapeamento do Fluxo Real:**
1. **Criação da carreira:** No Hub (`MainHub`), ao selecionar clube.
2. **Calendário:** Em `src/core/domain/seasonEngine.ts`, a função `scheduleRoundRobin` cria as partidas (fixtures) ao gerar a liga.
3. **Avanço de Semana:** Ocorre pelo Reducer central `advanceWeekLogic` (`src/core/state/reducers/advanceWeek.ts`), que chama a evolução, treinos, transferências e simulação de partida.
4. **Partida:** A simulação é feita em `src/core/domain/matchEngine.ts` (`simulateMatch`), calculando placares via distribuição Poisson e definindo avaliações e eventos da partida.
5. **Resultado e Estatísticas:** O resultado volta para o reducer, alimentando `seasonEngine.registerMatchResult` (que recalcula a classificação via `calculateStandings`) e o adapter acumula no log da temporada (`currentSeasonStats`).
6. **Fim da Temporada / Próxima Temporada:** No `advanceWeekLogic`, ao atingir a semana 52, a semana zera (vira 1) e o ano avança. **O problema:** Quando isso ocorre, o motor recria a liga chamando `createSeason` novamente para a nova temporada, mas não persiste as estatísticas antigas ou o histórico consolidado na tabela.
- **Problema de Match Log Engine (Global):** O array de `state.career.matches` recebe uma nova cópia de log completo de partida a cada jogo (`const newMatches = matchLog ? [matchLog, ...state.career.matches] : ...`). Com muitas simulações, o tamanho dessa array cresce demasiadamente, ocasionando gargalos de renderização quando atrelado ao `Context` do React.

---

## 3. TRANSFERÊNCIAS E MERCADO

- **Quando uma proposta é criada:** Na janela de transferências (semanas 24-32 e 50-4), a função `generateInterest` de `src/core/domain/transferEngine.ts` é acionada.
- **Critérios:** Times interessados são filtrados por OVR, Fama, Idade e "Tier" do clube (1 a 4). 
- **Ausência de Propostas:** Apenas um clube superior (ou de tier equivalente) oferece contrato. Se o jogador tiver 90 OVR no começo, somente clubes de Tier 1 se interessarão. E como a seleção envolve testes randômicos restritos (randomiza e escolhe um ou dois clubes no máximo), janelas inteiras podem fechar vazias por conta do RNG, sem garantir fluxos de propostas.
- **Clubes sem logo e Salário:** O salário baseia-se no Tier do clube: `baseSalary * (overall / 70) * (1 + fame / 200)`. Clubes sem logo aparecem pois os clubes do arquivo cru (Database/OpenFootball) nem sempre possuem `logo_url`.
- **Empréstimos e Renovações:** Estão preparados nas interfaces (`PlayerContract`), mas o sistema lógico automatizado de renovação e empréstimo **não** está presente no código, sendo um grande gap. As transferências ativas também dependem apenas de geração passiva de propostas da `transferEngine`.

---

## 4. DASHBOARD E NOTÍCIAS

- **Gráfico de Evolução Vazio/Irreal:**
  - Em `src/components/hub/DashboardView.tsx`, a variável `evolutionData` **não** lê o histórico do jogador (que sequer é persistido nesse formato ainda). Ela foi mockada com dados hardcoded: subtrai pontos arbitrariamente do OVR atual (`{ name: 'S1', ovr: Math.max(50, overall - 4) }`). Portanto, ele parece exibir uma curva mesmo quando o jogador não evolui nada de verdade.
- **News Feed Vazio:**
  - O `NewsFeed.tsx` renderiza a lista de `state.narrative.news`.
  - Contudo, em `advanceWeek.ts`, a chamada à `newsEngine.generateNews` está protegida dentro do bloco condicional da partida (`if (matchLog)`). Notícias de 'entrevistas', 'rumores' e 'bastidores' só têm chance de nascer caso uma partida aconteça naquela semana. Sem jogos, o avanço do tempo passa em branco.
- **Desatualização Visual:** Informações como estatísticas ou flags pontuais não disparam alertas persistentes, os números parecem estacionados até haver pulos significativos.

---

## 5. CLUBES, ESCUDOS E COMPETIÇÕES

| Entidade | Tipo | Logo Válido? | Placeholder/Fallback | Caminho/Origem Esperada | Status (`FootballData`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Clubes PL (Ingleses)** | Clube | Maioria Sim | Sim (Logo UI) | URL externa ou `/public/...` | `VALIDATED` |
| **Outras Ligas / Clubes BR** | Clube | Não | Sim | N/A (Vazio/null) | `UNCLASSIFIED` / `FLAGGED` |
| **Liga Nacional** | Competição | Não | Sim (Genérico) | N/A (Mocked list) | N/A |
| **Copa Nacional** | Competição | Não | Sim (Genérico) | N/A (Mocked list) | N/A |
| **Liga Continental** | Competição | Não | Sim (Genérico) | N/A (Mocked list) | N/A |

*Obs: A classe `FootballDataRepository` no parseamento normaliza `logo_url` vazia para `null`, gerando a utilização dos Placeholders visuais na interface.*

---

## 6. PERFORMANCE E ESTADO REACT

- **Descrição do Gargalo:** Ao utilizar um único `GameContext` (Context API + `useReducer`) que abraça todo o estado massivo do `GameState`, e selectors (`useGameSelector`) sendo usados em dezenas de componentes.
- **Componentes Afetados:** `DashboardView`, `MainHub`, Modelos 3D e toda a árvore inferior.
- **Causa da Lentidão:** O `advanceWeekLogic` em simulações longas (como 'Avançar Mês') despacha reduções pesadas e altera o array `matches`, resultando em renders que repintam todo o layout da HUD sem real necessidade, pois a árvore não tem granularidade de estado de isolamento nativa de bibliotecas como Zustand/Redux.
- **Risco de Refatoração Ampla:** É perigoso nesta etapa do projeto trocar de Context para Zustand. A mitigação recomendável é usar `useMemo`, `React.memo` em painéis pesados e limpar/truncar arrays de `matches` (por exemplo, guardar apenas últimas N partidas no log cru). A gravidade não bloqueia a lógica da carreira, mas gera *Jankiness* perceptível ao processar muitos dias ao mesmo tempo.

---

## 7. MAPA DE ARQUITETURA E FLUXO

```text
[ React Provider: GameEngine (Context) ]
    └── Dispacha Actions
        ├── flowReducer (Gerencia navegação entre HUB / MATCH / POST_MATCH)
        └── advanceWeek.ts (Reducer principal de avanço de tempo e lógica)

[ Integração Core & Engines ]
    ├── advanceWeek.ts 
    │    ├── seasonEngine.ts (Calendário, atualiza tabelas e avanços de fase)
    │    ├── matchEngine.ts (Simula a partida e eventos de gol, rating)
    │    ├── progressionEngine.ts (Calcula XP e altera `technical.stats`)
    │    ├── transferEngine.ts (Cria propostas nas janelas específicas)
    │    └── newsEngine.ts (Gera narrativas para o Feed de notícias)
    │
    ├── simulationEngine.ts (Aplica iterações múltiplas do `advanceWeek` via chunking em Background UI)
    └── draftEngine.ts (Gera stats do jogador baseado em "Idols")

[ Persistência e Dados ]
    ├── saveSystem.ts (Pega o GameState e escreve na LocalStorage)
    └── database.ts / FootballDataRepository (Provedor das Ligas/Clubes para o jogo)
```

---

## 8. BACKLOG PRIORIZADO E AÇÕES SUGERIDAS

### **[P0] — Bloqueia/Corrompe Experiência Crítica**
1. **OVR e Stats Quebrados na Criação (17 Anos = OverPower)**
   - *Causa:* O `DraftEngine` mapeia os stats dos maiores jogadores do mundo quase 1:1 sem penalizador rigoroso de idade ou escalonamento.
   - *Arquivos:* `draftEngine.ts`.
   - *Proposta de Solução:* Adicionar modificador na geração das opções de draft que limite as rolagens entre 45 e 70 no máximo para jovens talentos, possibilitando curvas de progressão justas.

### **[P1] — Funcionalidades Importantes Quebradas**
2. **Dashboard Visual Falso (Gráfico de Evolução)**
   - *Causa:* Componente zomba (mock) evolução subtraindo 1 a 4 pontos de OVR para renderizar a linha. Não rastreia o histórico real.
   - *Arquivos:* `DashboardView.tsx`, `initialState.ts` (para criar campo de histórico anual da evolução).
   - *Proposta de Solução:* Implementar a captura do OVR real na primeira semana de cada temporada no `career.history` e o `DashboardView` lê exatamente dali.
3. **News Feed e Engine Estagnados**
   - *Causa:* Eventos narrativos condicionados a ter acontecido jogo na semana e restritos a baixa chance de exibição.
   - *Arquivos:* `advanceWeek.ts`, `newsEngine.ts`.
   - *Proposta de Solução:* Remover a dependência de partida. Adicionar avaliações fora de jogos para injetar fofocas/entrevistas nas semanas vazias.

### **[P2] — Experiência Incompleta**
4. **Transferências Monótonas e Restritas**
   - *Causa:* Não existem empréstimos, renovações, e clubes limitados aos tiers de topo em casos de overall alto isolam o jogador.
   - *Arquivos:* `transferEngine.ts`.
   - *Proposta de Solução:* Criar eventos lógicos para Empréstimo, Renovação obrigatória de fim de contrato, e aumentar variação na aleatoriedade (RNG) do Mercado.
5. **Gargalos de Performance React**
   - *Causa:* `matches` list acumula logs integrais em state, re-render passivo global.
   - *Arquivos:* `advanceWeek.ts`, `selectors.ts`.
   - *Proposta de Solução:* Truncar logs detalhados antigos ou salvar separadamente, aplicar memoização nas Views (Dashboard, Evolution).

### **[P3] — Polimento e Visuais**
6. **Ligas e Clubes Genéricos**
   - *Causa:* Assets visuais em falta (null) na normalização.
   - *Arquivos:* `FootballDataRepository.ts`.
   - *Proposta de Solução:* Carregar packs em lote para badges mockados das competições core da aplicação (ex: Liga Continental).

---

## 9. RECOMENDAÇÃO DE ORDEM DOS PRÓXIMOS SPRINTS

Com base na auditoria, os itens vitais de UX e jogabilidade (sensação de carreira e desafio de início) estão danificados na fundação. A seguinte ordem é altamente recomendada para o cronograma:

1. **Sprint 1B:**
   - **Correção da Base (P0 e P1):**
     - Refatorar cálculo do *DraftEngine* para limitar o OVR e atributos, validando o crescimento do talento bruto.
     - Ajustar o Dashboard para não falsear o *Gráfico de Evolução*.
     - Desprender o *NewsFeed* das dependências estritas do `matchLog`, injetando vivacidade ao hub.

2. **Sprint 2:**
   - **Profundidade de Carreira (P2):**
     - Ampliar o `transferEngine` (incluir Empréstimos, sistema realista de Listagem/Deslistagem).
     - Acertar o "Save" das Tabelas nas viradas de temporada.

3. **Sprint 3:**
   - **Motor de Simulação e Performance (P2):**
     - Otimizar re-renders. Limpar / consolidar cache de array de partidas no `advanceWeek.ts` para aliviar peso de estado.

4. **Sprint 4:**
   - **Assets Visuais e Polimento (P3):**
     - Melhorar fallbacks, popular repositório de logos reais, refinos finais em 3D.
