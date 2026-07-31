# 14. Football Data Manager (Camada de Acesso a Dados)

## 1. Visão Geral
O **Football Data Manager (FDM)** atua como um padrão *Facade* e *Repository*. Ele será a única ponte de comunicação entre a Interface do Usuário (React) / Motor de Simulação e o Banco de Dados subjacente (SQLite WASM / IndexedDB). 

**Regra de Ouro:** Absolutamente nenhum componente React (ex: `PlayerCard.tsx`) ou função de simulação fará uma query SQL direta. Todos devem obrigatoriamente chamar os métodos do FDM.

## 2. Benefícios Arquiteturais
*   **Desacoplamento Tecnológico:** Se no futuro trocarmos o SQLite WASM por outra tecnologia (ex: Dexie.js ou um banco em nuvem real via API), o React nem perceberá, pois os métodos (`getClub`, `getPlayer`) continuarão retornando as mesmas interfaces.
*   **Controle de Cache em Memória:** O FDM pode segurar na memória RAM os dados mais acessados (como os atributos do jogador atual), evitando chamadas repetitivas ao disco.
*   **Processamento em Lote (Batching):** O FDM pode otimizar atualizações maciças (ex: envelhecer 10.000 jogadores na virada do ano) através de transações otimizadas.

## 3. Interface da API (Os Métodos)
O FDM será uma classe Singleton `class FootballDataManager` contendo métodos assíncronos (Promises), pois o acesso a discos locais via WASM ou IndexedDB é assíncrono.

### 3.1. Entidades Base (Leitura Rápida)
*   `getClub(clubId: string): Promise<Club>`
*   `getLeague(leagueId: string): Promise<League>`
*   `getCompetition(competitionId: string): Promise<Competition>`
*   `getNation(nationId: string): Promise<Nation>`

### 3.2. Jogadores e Elencos (Leitura e Filtros)
*   `getPlayer(playerId: string): Promise<Player>`
*   `getPlayersByClub(clubId: string): Promise<Player[]>`
*   `searchPlayers(filters: PlayerFilters): Promise<Player[]>` - Retorna lista páginada filtrando por Idade, Posição, Valor.
*   `getFreeAgents(): Promise<Player[]>`

### 3.3. Competições e Tabelas
*   `getStandings(competitionId: string, seasonId: string): Promise<StandingRow[]>` - Calcula e retorna a tabela de classificação ordenada.
*   `getFixtures(competitionId: string, matchday?: number): Promise<Fixture[]>` - Jogos de uma rodada.
*   `getClubFixtures(clubId: string, seasonId: string): Promise<Fixture[]>` - O calendário completo de um time específico no ano.

### 3.4. Dinâmica e Histórico
*   `getTransfers(seasonId: string, clubId?: string): Promise<Transfer[]>`
*   `getPlayerHistory(playerId: string): Promise<PlayerSeasonStat[]>` - O histórico de carreira.
*   `getClubHistory(clubId: string): Promise<ClubSeasonStat[]>`

### 3.5. Mutações (As ações do Motor de Jogo)
*   `processTransfer(playerId, fromClubId, toClubId, fee, newContract): Promise<void>` - Transação atômica que subtrai dinheiro, deleta contrato antigo e cria um novo.
*   `saveMatchResult(fixtureId, homeScore, awayScore, events): Promise<void>` - Salva o jogo e atualiza a tabela (`Standings`) invisivelmente.
*   `updatePlayerAttributes(playerId, attributeChanges): Promise<void>` - Após o treino, atualiza os stats.

## 4. Integração com o React (Custom Hooks)
Para que os componentes React não virem uma bagunça de `useEffect` lidando com Promises, criaremos adaptadores (Hooks) que conversam com o FDM.

**Exemplo de uso proibido (Acesso Direto):**
```tsx
// ❌ ERRADO
const db = useSQLite();
const club = db.query("SELECT * FROM clubs WHERE id = 1");
```

**Exemplo de uso correto (Via FDM Hooks):**
```tsx
// ✅ CERTO
export function ClubView({ clubId }) {
  // Este hook chama o FootballDataManager por baixo dos panos e gerencia o loading/cache.
  const { data: club, isLoading } = useClub(clubId); 
  const { data: players } = useClubSquad(clubId);
  
  if (isLoading) return <Spinner />;
  return <div>{club.name}</div>;
}
```

## 5. Trade-offs Decididos
**Dilema: Cache Sincrono vs. Acesso Assíncrono Puro**
*   **Decisão:** O FDM retornará *sempre* Promises (Assíncrono). 
*   **Vantagens:** Mantém a interface fiel à realidade de bancos de dados modernos. Evita o travamento da thread principal (Main Thread) do navegador durante buscas pesadas de milhares de jogadores.
*   **Desvantagens:** O React precisará sempre lidar com estados de `loading`, mesmo para carregar informações simples de um Clube.
*   **Mitigação:** Utilizaremos padrões como o `SWR` ou `React Query` (ou criaremos nosso cache leve equivalente) envolto nos Hooks do FDM para garantir que acessos repetidos a `getClub('real_madrid')` batam na RAM (resposta imediata) ao invés de recalcular a query no disco local a cada re-render.
