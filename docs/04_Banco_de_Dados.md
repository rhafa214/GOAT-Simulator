# 04. Modelagem de Banco de Dados

## 1. Visão Geral (Prisma Schema)
O banco relacional PostgreSQL (Supabase) será modelado através do Prisma. A principal função do banco é:
1. Autenticação de Usuários (via Supabase Auth - opcional, mas previsto).
2. Armazenamento de "Saves" da carreira na nuvem.
3. Tabela de Leaderboard (Melhores carreiras globais para fator social).

## 2. Entidades Iniciais Previstas

### User (Usuário)
Armazena dados básicos de quem está jogando.
*   `id` (String / UUID) - PK
*   `email` (String) - Unique
*   `createdAt` (DateTime)
*   `updatedAt` (DateTime)

### CareerSave (Save do Jogo)
Armazena o estado "congelado" do motor de jogo para load posterior. Como o motor de jogo local gerencia dezenas de tabelas de forma dinâmica (times, ligas, jogadores), salvar isso estritamente de forma relacional seria custoso e lento. Usaremos JSONB para o core.
*   `id` (String / UUID) - PK
*   `userId` (String / UUID) - FK -> User
*   `playerName` (String) - Nome do avatar para listagem rápida
*   `currentWeek` (Int) - Progresso
*   `currentYear` (Int)
*   `overall` (Int) - Média do jogador
*   `gameState` (JSONB) - O dump completo do `GameEngineContext` (Atributos, Times, Histórico).
*   `createdAt` (DateTime)
*   `updatedAt` (DateTime)

### Leaderboard (Placar Global)
Uma tabela mais "flat" para exibir os maiores de todos os tempos sem precisar decodificar o `gameState`.
*   `id` (String / UUID) - PK
*   `userId` (String / UUID) - FK -> User
*   `playerName` (String)
*   `totalGoals` (Int)
*   `ballonDorCount` (Int)
*   `score` (Int) - Uma pontuação calculada baseada nas conquistas da carreira
*   `createdAt` (DateTime)

## 3. Trade-offs Decididos
*   **Decisão:** Salvar o progresso inteiro em um campo `JSONB` (`gameState`) ao invés de criar dezenas de tabelas (`Match`, `Transfer`, `Attribute`, etc).
*   **Vantagens:** 
    * O Load/Save é imediato: 1 query para baixar o JSON inteiro, injetar direto no `initialState` do React.
    * Extremamente resiliente a mudanças de código. Se amanhã adicionarmos um campo novo no jogo (ex: "temNamorada: boolean"), não precisamos rodar migration relacional. O JSON aceita livremente.
*   **Desvantagens:**
    * Perda de normalização. 
    * Difícil consultar dados específicos direto via SQL (ex: "Quantos jogadores tem nível > 90 globalmente?"), mas o foco do banco é persistir o save do usuário individual, não mineração de dados globais (que não sejam os do Leaderboard).

---
**Status Atual:** Concluído.
**Próximo Passo Planejado:** Descrição das Telas.
