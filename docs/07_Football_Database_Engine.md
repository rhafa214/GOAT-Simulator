# 07. Football Database Engine (Arquitetura)

## 1. Visão Geral
O **Football Database Engine** será o motor de dados do jogo. Diferente de um banco de dados tradicional focado em CRUD de retaguarda, este é o "cérebro" da simulação que rodará localmente no cliente (navegador). Ele precisa armazenar, relacionar e processar milhares de entidades (Países, Ligas, Clubes, Jogadores) com extrema eficiência.

A arquitetura será inspirada em jogos AAA de simulação esportiva (como Football Manager), focando em normalização estrutural, consultas em tempo constante O(1) e processamento em lote rápido.

## 2. Desafios Arquiteturais
*   **Performance (Memória vs Processamento):** Armazenar 10.000 jogadores na memória do navegador é perfeitamente viável (poucos megabytes). O problema ocorre se tentarmos copiar profundamente (deep copy) todo o banco a cada atualização utilizando puramente estados imutáveis do React (`useState` / `useReducer`).
*   **Relacionamentos Complexos:** Um jogador pertence a um clube, que participa de uma liga, que pertence a um país, que joga partidas simuladas gerando estatísticas. Percorrer essa árvore deve ser imediato.
*   **Persistência (Save Game):** Um "save" precisa capturar o delta (o que mudou desde o estado inicial) ou o snapshot completo de maneira que possa ser restaurado rapidamente via IndexedDB ou Cloud (Supabase).

## 3. Padrão Arquitetural (In-Memory Normalized Graph)

Para evitar os gargalos do React, o Engine não viverá puramente dentro do contexto do React. 

**Abordagem: Classe de Domínio (Singleton / Instância Gerenciada)**
Criaremos um núcleo agnóstico de UI, puramente em TypeScript.
*   **Estado Normalizado:** Todas as entidades serão armazenadas em mapas de chave-valor (Dicionários), evitando aninhamentos profundos.
*   **Padrão de Tabelas Relacionais (In-Memory):**
    ```typescript
    // Exemplo de estrutura normalizada
    state = {
      players: {
        byId: { "p_1": { id: "p_1", name: "Ronaldo", clubId: "c_1" } },
        allIds: ["p_1"]
      },
      clubs: {
        byId: { "c_1": { id: "c_1", name: "Inter" } },
        allIds: ["c_1"]
      }
    }
    ```
*   **Índices e Views Dinâmicas:** Manteremos estruturas auxiliares para consultas rápidas (ex: `playersByClubId`, `clubsByLeagueId`), atualizadas em tempo real.
*   **Integração com React:** O React consumirá esse motor utilizando um padrão de Observer (Pub/Sub) ou adaptadores. A UI só renderiza o que precisa ver, enquanto a simulação roda solta por baixo.

## 4. Modelagem de Entidades Central (Core Schema)

Abaixo estão as definições lógicas (não os dados, mas a estrutura) das principais entidades.

### 4.1. Mundo e Estrutura Geográfica
*   **Nation (País):** `id`, `name`, `code`, `continent`.
*   **Competition (Competição):** `id`, `name`, `type` (LEAGUE, CUP, CONTINENTAL), `nationId`, `reputation`, `tier` (Divisão 1, 2, etc).

### 4.2. Estrutura de Clubes
*   **Club:**
    *   `id` (String UUID)
    *   `name`, `shortName`, `abbreviation`
    *   `nationId` (FK)
    *   `reputation` (0-10.000)
    *   `finances` (Balance, Transfer Budget, Wage Budget)
    *   `facilities` (Training, Youth - 0-20)
    *   `colors` (Primary, Secondary)
    *   `stadium` (Nome, Capacidade)

### 4.3. Estrutura de Jogadores e Staff
*   **Player:**
    *   `id` (String UUID)
    *   `personal`: Nome, Idade, Data de Nascimento, Nacionalidade (FK).
    *   `clubId` (FK, nulo se Free Agent).
    *   `attributes`: Físicos, Técnicos, Mentais (Separados e escaláveis).
    *   `condition`: Fitness, Morale, Sharpness (Dinâmicos).
    *   `contract`: Salário, Data de Término, Cláusulas.
    *   `stats`: Histórico de Carreira, Partidas, Gols, Assistências.
    *   `reputation` (0-10.000) e `potential` (PA) / `currentAbility` (CA).

### 4.4. Estrutura de Partidas (Match Engine Data)
*   **Fixture (Partida Agendada/Concluída):**
    *   `id`, `competitionId`, `date`.
    *   `homeClubId`, `awayClubId`.
    *   `status` (PENDING, IN_PROGRESS, FINISHED).
    *   `result`: `homeScore`, `awayScore`, `events` (Gols, Cartões).

## 5. Estratégia de Indexação e Acesso a Dados

O motor possuirá métodos de acesso rápido encapsulados (Data Access Object - DAO):
*   `db.getClub(id)`: Retorna O(1).
*   `db.getPlayersByClub(clubId)`: O(1) através do índice.
*   `db.getStandings(competitionId)`: Retorna a tabela calculada baseada nas `fixtures`.
*   `db.transferPlayer(playerId, fromClubId, toClubId, fee)`: Transação atômica que atualiza orçamentos, contratos e índices.

## 6. Pipeline de Inicialização (Boot)
Como não podemos carregar tudo aleatoriamente, o jogo iniciará com:
1.  **Seed Data Loader:** Um carregador que lê arquivos estáticos (estruturados previamente no código, ex: `data/clubs.ts`) e hidrata o banco em memória.
2.  **Index Builder:** Constrói as relações (popula `playersByClubId`).
3.  **Simulation Ready:** O motor emite um evento avisando que a simulação pode começar.

## 7. Próximos Passos
Esta é a fundação. Para implementar:
1. Devemos criar a classe base `FootballDatabase` e suas estruturas internas de dicionário.
2. Definir estritamente as interfaces TypeScript no `types.ts`.
3. Criar os métodos de CRUD, relacionamento e índices.
4. (No futuro) Integrar o Match Engine local para iterar os dias consumindo estes dados.
