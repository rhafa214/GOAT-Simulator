# Arquitetura Alvo: GOAT Simulator

Este documento detalha a arquitetura de software planejada para a primeira versão jogável, orientada à escalabilidade, testabilidade e separação de responsabilidades. O objetivo é remover regras de negócio dos componentes e do orquestrador de estado global, centralizando-as em módulos agnósticos e determinísticos.

## 1. Princípios Arquiteturais
- **Separação de Camadas (Clean/DDD inspired):** Domain, Application, Infrastructure e Presentation.
- **Funções Puras no Domínio:** Lógicas (cálculo de evolução de atributos, desfecho de partidas) devem depender unicamente das suas entradas explícitas (ex. injetando o RNG e dados das equipes).
- **Reducers Limpos:** O GameEngine usará seu reducer apenas para encaminhar os dados para a camada Application (Casos de uso), sem realizar cálculos de negócio internamente.

## 2. Camadas do Sistema

### 2.1 Domain
O coração do jogo, agnóstico à biblioteca UI (React).
- **Entidades e Value Objects:** Player, Club, MatchStats, Calendar, Event, etc.
- **Regras Puras:** Funções que determinam mecânicas, evolução física/técnica, cálculos financeiros e condições de eventos.
- **Dependências Permitidas:** Apenas tipos globais base.
- **Dependências Proibidas:** React, Vite, qualquer API do browser (LocalStorage, window), bibliotecas externas impuras.

### 2.2 Application
Contém Casos de Uso (Use Cases) / Comandos que orquestram a ação de um fluxo e alteram o estado.
- **Responsabilidade:** Interpretar intenções do jogador (ex: "Avançar Semana"), coordenar as regras do domínio, interagir com infraestrutura (ex: acionar um RNG ou carregar mock de times) e retornar o novo estado imutável.
- **Entradas e Saídas:** Recebe o `GameState` atual, dependências externas (como o RNG injetado) e parâmetros da ação. Retorna um novo `GameState`.
- **Dependências Permitidas:** Domain, portas (interfaces) de Infrastructure.
- **Dependências Proibidas:** Presentation (UI), React.

### 2.3 Infrastructure
Serviços que se comunicam com o mundo real ou simulam aleatoriedade.
- **Módulos:** RNG, API do Gemini (AI), Persistência (LocalStorage).
- **Responsabilidade:** Prover dados imprevisíveis ou de banco de dados/API.
- **Dependências Permitidas:** Domain (para formatar saídas no formato correto).
- **Dependências Proibidas:** Regras de negócio essenciais (não deve decidir se algo ocorre, apenas fornecer o número aleatório ou fazer a chamada de rede).

### 2.4 Presentation
A interface de usuário em React.
- **Responsabilidade:** Renderizar os dados e enviar as ações para a store.
- **Módulos:** Componentes visuais, Context API providers, custom hooks (como `useGameEngine`).
- **Dependências Permitidas:** Game State (Store), Tipos de domínio, bibliotecas de UI (Tailwind, Lucide, Recharts).
- **Dependências Proibidas:** Lógicas de simulação puras diretamente nos eventos de clique.

### 2.5 Game State (Store)
- **Responsabilidade:** Manter a "árvore única da verdade".
- **Implementação:** Context API + `useReducer`. O reducer é reescrito para mapear ações (ex: `ADVANCE_WEEK`) diretamente para Casos de Uso (ex: `AdvanceWeekUseCase(state)`).

## 3. Principais Sistemas de Jogo

### 1. Player
- **Responsabilidade:** Gerir evolução, personalidade e condição do atleta.
- **Domínio (Pure):** Como a idade afeta atributos, como o cansaço é gerado.
- **Ordem de Migração:** Alta prioridade (cálculos de treino).

### 2. Career
- **Responsabilidade:** Histórico de clubes, contratos, troféus e finanças.
- **Domínio (Pure):** Lógica de aumento salarial ou prêmios.

### 3. Calendar
- **Responsabilidade:** Mapeamento do ano esportivo, progressão de semanas (1 a 52).
- **Domínio (Pure):** Controle rigoroso de limite de semanas e ano letivo.

### 4. Match & Simulation
- **Responsabilidade:** Motor de simulação de partidas.
- **Domínio (Pure):** Lógica de chances de gols, desgaste físico do jogo, nota média (rating), chance de lesão. Depende da injeção do RNG.

### 5. Event & Narrative
- **Responsabilidade:** Eventos contextuais ou randômicos que testam o player (lesões, propostas, brigas).
- **Domínio (Pure):** Validação de condição do evento (`condition(state)`), pesos da roleta, cálculo das penalidades ou bônus de escolhas.

### 6. Transfer, Competition, News, Awards, Save
- Sistemas paralelos que interagem ou reagem aos fluxos principais (ex: Fim de temporada aciona cálculo de Awards e checagem de rebaixamento das Competitions).

## 4. Proposta de Estrutura de Pastas (Compatível com o Repositório Atual)

```text
src/
├── app/               # Rotas, Providers principais
├── components/        # Camada Presentation
│   ├── ui/            # Elementos reutilizáveis
│   ├── hub/           # Dashboard e áreas principais
│   ├── creation/      # Fluxo de criação de personagem
│   └── 3d/            # Elementos 3D e renderização
├── core/              # O núcleo isolado (Domain + Application)
│   ├── domain/        # Entidades e funções puras (ex: player.ts, match.ts)
│   ├── useCases/      # Lógicas orquestradas (ex: advanceWeek.ts, resolveEvent.ts)
│   └── state/         # Reducer, ações e definição do estado global base
├── infrastructure/    # Implementações de serviços externos
│   ├── rng/           # Instâncias de rng
│   ├── data/          # Fontes de dados JSON estáticos (clubes, eventos)
│   └── ai/            # Cliente e lógicas do Gemini
├── types/             # Tipagens globais do sistema
└── utils/             # Helpers e formatadores básicos genéricos
```

## 5. Estratégia de Migração (Refatoração Gradual)
1. **Auditoria:** (Completa) Diagnosticar o código atual.
2. **Testes de Caracterização:** (Completo) Testar os fluxos antes das mudanças.
3. **Mapeamento de Tipos e Core:** Criar as pastas e migrar definições de tipos para dentro de `core/domain` e `core/state`.
4. **Extração de Casos de Uso:** Mover lógicas massivas (como `advanceWeekLogic`) para dentro da pasta `core/useCases`, injetando a dependência de `rng` ao invés de usar módulo global/singleton puro.
5. **Divisão de Casos de Uso em Domain Services:** Quebrar o `advanceWeekLogic` em funções puras dentro de `core/domain` (ex: `simulateMatch(player, opp, rng)`, `evolveAttributes(player, matchStats)`, `checkEvents(state, rng)`).
6. **Limpeza da UI:** Remover cálculos matemáticos e lógicas soltas de dentro de componentes da UI para chamadas limpas aos Casos de Uso na store.
7. **Testes Contínuos:** Cada função de Domínio criada receberá testes unitários exaustivos imediatamente.

Não realizaremos reescrita de ponta-a-ponta, mas sim um "Strangler Fig Pattern", estrangulando o `GameEngine.tsx` aos poucos movendo suas partes para o modelo proposto.
