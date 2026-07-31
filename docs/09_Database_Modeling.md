# 09. Modelagem Física do Banco de Dados (Engine Local)

## 1. Escolha da Tecnologia

Para suportar **centenas de temporadas simuladas** rodando puramente no cliente (navegador), não podemos manter todo o banco de dados armazenado em objetos de memória (RAM), pois isso causaria vazamentos de memória (Memory Leaks) e travaria a aba do navegador após algumas dezenas de temporadas (devido ao acúmulo de histórico de partidas, jogadores aposentados e estatísticas).

**A Tecnologia Escolhida: SQLite WASM com OPFS (Origin Private File System)**
*   **O que é:** O banco de dados relacional mais rápido do mundo (SQLite) compilado em WebAssembly (WASM) para rodar no navegador, persistindo os dados em disco local através da API de OPFS.
*   **Por que:** Ele permite rodar consultas SQL reais (`JOIN`, `GROUP BY`) com performance quase nativa. Dados frios (como partidas de 50 anos atrás) ficam no disco do usuário e só são carregados para a RAM quando o usuário abre a tela de histórico.
*   **Alternativa (Fallback):** IndexedDB utilizando a biblioteca **Dexie.js**. Embora seja NoSQL, o Dexie suporta indexação poderosa e lidaria muito bem com o arquivamento. Assumiremos um modelo relacional que serve para ambas as abordagens.

---

## 2. Estrutura de Tabelas, Chaves e Relacionamentos

Abaixo está o DDL lógico e a explicação de cada entidade. O banco é normalizado na 3ª Forma Normal (3FN) para evitar redundância, mas desnormalizado estrategicamente em dados históricos para performance.

### 2.1. Geografia
Tabelas imutáveis (ou de raras mudanças) que servem de base.

#### `nations` (Países)
*   **`id`** (VARCHAR/UUID) - **[PK]**
*   **`name`** (VARCHAR) - Ex: Brasil, Inglaterra.
*   **`code`** (VARCHAR) - Ex: BRA, ENG (Útil para ícones de bandeiras).
*   **`continent`** (VARCHAR) - Ex: SA, EU.
*   **`reputation`** (INT) - 0 a 10000. Define a qualidade dos jogadores gerados (newgens).
*   **Índices:** `idx_nations_continent` (para buscar países de um continente rápido).

#### `cities` (Cidades)
*   **`id`** (VARCHAR/UUID) - **[PK]**
*   **`name`** (VARCHAR)
*   **`nation_id`** (VARCHAR) - **[FK]** -> `nations.id`

---

### 2.2. Organização Esportiva

#### `competitions` (Competições)
*   **`id`** (VARCHAR/UUID) - **[PK]**
*   **`name`** (VARCHAR) - Ex: Premier League.
*   **`nation_id`** (VARCHAR) - **[FK]** -> `nations.id` (Pode ser nulo para competições continentais/mundiais).
*   **`type`** (VARCHAR) - 'LEAGUE', 'CUP', 'CONTINENTAL'.
*   **`tier`** (INT) - Nível da divisão (1 para Primeira Divisão, 2 para Segunda).
*   **`reputation`** (INT) - Define o peso da competição e dinheiro de TV.

#### `clubs` (Clubes)
*   **`id`** (VARCHAR/UUID) - **[PK]**
*   **`name`** (VARCHAR)
*   **`short_name`** (VARCHAR) - Ex: Man Utd.
*   **`nation_id`** (VARCHAR) - **[FK]** -> `nations.id`
*   **`city_id`** (VARCHAR) - **[FK]** -> `cities.id`
*   **`reputation`** (INT) - 0 a 10000. Define quem aceita assinar com o clube.
*   **`balance`** (BIGINT) - Dinheiro em caixa (finanças).
*   **`transfer_budget`** (BIGINT) - Orçamento para compras.
*   **`colors_primary`** / **`colors_secondary`** (VARCHAR) - Hexadecimal para a UI.
*   **Índices:** `idx_clubs_nation` (para montar ligas rapidamente).

---

### 2.3. Atores Individuais

#### `players` (Jogadores)
A tabela que mais cresce. Milhares de novos jogadores (newgens) são criados com o passar das décadas.
*   **`id`** (VARCHAR/UUID) - **[PK]**
*   **`first_name`** / **`last_name`** (VARCHAR)
*   **`birth_date`** (DATE) - Idade é calculada em tempo real com base no calendário do jogo.
*   **`nation_id`** (VARCHAR) - **[FK]** -> `nations.id`
*   **`club_id`** (VARCHAR) - **[FK]** -> `clubs.id` (Nulo significa Free Agent).
*   **`position`** (VARCHAR) - Ex: 'ST', 'CB', 'CM'.
*   **`status`** (VARCHAR) - 'ACTIVE', 'RETIRED'.
*   **`current_ability`** (INT) - 1 a 100 (O "Overall" atual).
*   **`potential_ability`** (INT) - O limite genético máximo do jogador.
*   **Índices:** `idx_players_club` (muito usado: "listar elenco"), `idx_players_status` (filtrar apenas ativos).

#### `player_attributes` (Atributos do Jogador - 1:1)
Separado da tabela `players` porque é atualizado frequentemente (sistema de treino) e é pesado.
*   **`player_id`** (VARCHAR/UUID) - **[PK]** / **[FK]** -> `players.id`
*   **`pac`, `sho`, `pas`, `dri`, `def`, `phy`** (INT) - Físicos, técnicos, etc.
*   **`fitness`** (INT) - Condição física (0 a 100). Cai após jogos, sobe com descanso.
*   **`morale`** (INT) - 0 a 100. Afeta performance em campo.

#### `contracts` (Contratos)
*   **`id`** (VARCHAR/UUID) - **[PK]**
*   **`player_id`** (VARCHAR/UUID) - **[FK]** -> `players.id`
*   **`club_id`** (VARCHAR/UUID) - **[FK]** -> `clubs.id`
*   **`wage`** (BIGINT) - Salário semanal.
*   **`start_date`** / **`end_date`** (DATE) - Quando o contrato expira.
*   **Índices:** `idx_contracts_expiration` (para o motor calcular renovações e multas).

---

### 2.4. Motor de Partidas (A Máquina do Tempo)

#### `seasons` (Temporadas)
*   **`id`** (VARCHAR/UUID) - **[PK]**
*   **`year`** (INT) - Ex: 2024.

#### `fixtures` (Partidas)
Esta tabela registra todos os jogos. Milhares de linhas por temporada.
*   **`id`** (VARCHAR/UUID) - **[PK]**
*   **`season_id`** (VARCHAR) - **[FK]** -> `seasons.id`
*   **`competition_id`** (VARCHAR) - **[FK]** -> `competitions.id`
*   **`date`** (DATE) - Dia em que a partida deve ser processada.
*   **`home_club_id`** / **`away_club_id`** (VARCHAR) - **[FK]** -> `clubs.id`
*   **`home_score`** / **`away_score`** (INT)
*   **`status`** (VARCHAR) - 'SCHEDULED', 'PLAYED'.
*   **Índices:** `idx_fixtures_date` (para o motor saber o que processar "hoje"), `idx_fixtures_club` (para montar a tela de "Próximos Jogos" de um time).

---

### 2.5. Estatísticas e Escalabilidade (O Segredo para Centenas de Temporadas)

Se guardarmos cada gol de cada partida em uma tabela `match_events`, após 100 anos o banco terá milhões de registros inúteis e a aba travará. A solução é o **Arquivamento e Sumarização Anual**.

#### `player_season_stats` (O Histórico de Carreira)
Esta é a tabela mais inteligente do jogo. Ao final de cada temporada, o motor deleta os dados minuciosos daquele ano e consolida o histórico aqui.
*   **`id`** (VARCHAR/UUID) - **[PK]**
*   **`player_id`** (VARCHAR) - **[FK]** -> `players.id`
*   **`season_id`** (VARCHAR) - **[FK]** -> `seasons.id`
*   **`club_id`** (VARCHAR) - **[FK]** -> `clubs.id`
*   **`competition_id`** (VARCHAR) - **[FK]** -> `competitions.id`
*   **`matches_played`** (INT)
*   **`goals`** (INT)
*   **`assists`** (INT)
*   **`avg_rating`** (DECIMAL) - Nota média no ano.
*   **Índices:** `idx_pss_player` (carrega o histórico completo de um jogador em O(1)).

#### `club_season_standings` (O Histórico de Clubes)
Guarda a tabela final do campeonato ao fim da temporada.
*   **`id`** (VARCHAR/UUID) - **[PK]**
*   **`club_id`, `season_id`, `competition_id`** - **[FKs]**
*   **`points`, `wins`, `draws`, `losses`, `goals_pro`, `goals_con`** (INT)
*   **`final_position`** (INT) - 1º, 2º, rebaixado.

---

### 2.6. Transações e Vida Útil

#### `transfers` (Histórico de Transferências)
*   **`id`** (VARCHAR/UUID) - **[PK]**
*   **`player_id`** (VARCHAR) - **[FK]**
*   **`from_club_id`** / **`to_club_id`** (VARCHAR) - **[FKs]**
*   **`fee`** (BIGINT) - Valor da transferência.
*   **`date`** (DATE)

#### `awards` (Premiações / Salão da Fama)
Para não esquecermos dos heróis de 50 temporadas atrás.
*   **`id`** (VARCHAR/UUID) - **[PK]**
*   **`type`** (VARCHAR) - 'BALLON_DOR', 'GOLDEN_BOOT', 'LEAGUE_CHAMPION'.
*   **`season_id`** (VARCHAR) - **[FK]**
*   **`winner_player_id`** (VARCHAR) - Nulo se for prêmio de time.
*   **`winner_club_id`** (VARCHAR) - Nulo se for prêmio individual.

---

## 3. Dinâmica de Manutenção (Garbage Collection Interno)

Para garantir que o jogo consiga chegar no ano de 2150 sem lentidão:

1.  **Aposentadoria e Reencarnação:** Quando um jogador atinge ~35-40 anos, ele se aposenta. Seu registro em `players` muda para `status='RETIRED'`. Seus atributos físicos e técnicos pesados (`player_attributes`) **são deletados**. Apenas seu nome e ID permanecem vivos para que o seu histórico em `player_season_stats` continue acessível para o usuário ler, mas ele pesa 1% do tamanho original.
2.  **Criação de Newgens:** No mesmo dia que jogadores se aposentam, o banco insere novos jogadores jovens (`age=16`) usando a reputação dos países (`nations`) para distribuir o potencial.
3.  **Expurgo de Notícias:** Mensagens na caixa de entrada do jogador com mais de 2 temporadas são deletadas sem dó, exceto títulos ganhos.
4.  **Processamento Ligeiro:** Em "férias" (off-season), o banco processa transferências e renovações em *Batches* (lotes), utilizando transações (`BEGIN TRANSACTION; ... COMMIT;`), atualizando 5.000 jogadores em menos de 10 milissegundos.
