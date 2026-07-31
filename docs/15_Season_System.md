# 15. Sistema de Temporadas (Season System)

## 1. Visão Geral
O simulador de carreira exige que o mundo continue girando e mantendo registros imutáveis. O **Sistema de Temporadas** é o módulo responsável por orquestrar o tempo e garantir que cada ano simulado deixe uma "pegada" definitiva no banco de dados. "Tudo deve ficar salvo para sempre."

## 2. Estrutura Lógica da Temporada

Uma temporada é um contêiner (agrupador cronológico) para uma infinidade de eventos.

### Entidade: `Season` (Temporada)
*   **Ano (Year):** O identificador anual (ex: `2024` ou `2024/2025`).
*   **Status:** `UPCOMING` (Pré-temporada), `ACTIVE` (Rolando), `FINISHED` (Encerrada/Arquivada).

## 3. O que fica salvo "Para Sempre" (Camadas de Arquivamento)

Quando uma Temporada termina, o motor de jogo realiza o **Fechamento de Ciclo (End of Season Processing)**, consolidando dados voláteis (partidas isoladas) em dados frios (Estatísticas Anuais).

### 3.1. Classificação e Conquistas Coletivas
Tudo isso é registrado na tabela `club_season_standings` e no `club_history`.
*   **Classificação (Standings):** A tabela final exata daquela temporada (Posição, P, V, E, D, SG, Pontos).
*   **Campeão e Vice:** Gravados permanentemente como troféus no perfil do clube e nos registros da Competição.
*   **Rebaixados e Promovidos:** Clubes que terminaram nas zonas de corte têm sua propriedade `tier` (divisão) alterada para a temporada seguinte, mas o registro de que caíram ou subiram no ano X fica salvo.

### 3.2. Estatísticas Individuais (Histórico de Jogador)
Isso é registrado na tabela `player_season_stats` que serve como o histórico de vida do atleta.
*   **Artilheiros e Assistências:** Calculados com base no somatório do ano.
*   **Estatísticas Fixadas:** Para cada jogador, salva-se `Gols`, `Assistências`, `Partidas Jogadas`, `Nota Média` naquele ano, por aquele clube.

### 3.3. Transações Financeiras e Premiações
*   **Transferências (Transfers):** Todas as negociações que ocorreram naquele ano (Origem, Destino, Jogador, Valor, Data). Nunca são apagadas.
*   **Premiações (Awards):** Bola de Ouro (Ballon d'Or), Chuteira de Ouro (Golden Boot), Luva de Ouro, Seleção do Ano, Jovem do Ano. Salvos na tabela de `awards` referenciando o `season_id`.

### 3.4. O Calendário Histórico (Fixtures)
*   As partidas jogadas (Fixtures) de temporadas muito antigas *podem* sofrer limpeza de eventos minuciosos (ex: apagar minuto exato do cartão amarelo de 10 anos atrás para economizar disco), mas o placar (2x1) e quem marcou os gols (via estatísticas consolidadas) ficam vivos no banco. O usuário poderá voltar a 2024 no ano de 2040 e ver que a final da Champions foi 3x1.

## 4. O Fluxo do Fim de Temporada (End of Season Routine)
A rotina técnica que o Motor deve rodar no último dia do calendário da temporada:

1.  **Congelamento das Tabelas (Standings Freeze):** Calcula campeões e rebaixados.
2.  **Distribuição de Prêmios:** Motor de IA (ou fórmulas numéricas) calcula o melhor do mundo e premia.
3.  **Arquivamento de Jogadores (Stats Consolidation):** Pega os gols de cada partida e soma em um único registro no `player_season_stats`.
4.  **Atualização de Ligas:** Promove e rebaixa os times no nível de banco de dados (`club.tier`).
5.  **Aposentadoria e Regens:** Aposenta veteranos e gera novos jovens promissores.
6.  **Nova Temporada:** Cria a Entidade `Season` (ex: 2025/2026), gera o novo Calendário (`Fixtures`) para todas as ligas zerado, renova orçamentos dos clubes e muda o status da temporada antiga para `FINISHED`.

## 5. Como o Football Data Manager (FDM) consome isso?
O FDM possuirá métodos de filtragem por ano:
*   `getStandings(competitionId, seasonId)`: Se passarmos `seasonId='2024'`, veremos a tabela de 2024. Se passarmos a atual, veremos a viva.
*   `getAwards(seasonId)`: Para ver quem ganhou a Bola de Ouro em um ano específico.
*   `getPlayerCareer(playerId)`: Agrupa todas as entradas de `player_season_stats` e lista os times que defendeu, ano a ano.

Esta arquitetura garante que o universo do jogo tenha memória e história, quebrando a sensação de descartabilidade.
