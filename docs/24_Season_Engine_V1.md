# 24. Season Engine V1

## Visão Geral
O `SeasonEngine` (`src/core/domain/seasonEngine.ts`) é a primeira versão do orquestrador temporal das competições, operando exclusivamente através de funções puras. Ele gerencia o ciclo de vida de uma temporada, tabelas, rodadas e estado das competições (como Ligas e Copas).

## Responsabilidades
1. **Criação e Registro:** `createSeason` inicia uma temporada associada a um ano (ex: 2024). `registerLeagueCompetition` permite o registro de competições (Ligas Nacionais) com os clubes participantes, gerando automaticamente a tabela (Standings) inicial e o calendário de jogos (Fixtures).
2. **Ciclo Semanal:** Fornece acesso rápido à rodada atual (`currentWeek`), permite a busca do próximo jogo de um clube específico (`getNextFixtureForClub`) e tem uma função para avançar a semana/rodada (`advanceSeasonWeek`).
3. **Resolução de Resultados:** Contém rotinas de aplicação de resultados (`registerMatchResult`) que atualizam o placar da partida específica e recalculam automaticamente as classificações daquela competição.
4. **Partidas Importantes:** Implementa `getMatchImportance` baseada no tipo de competição e contexto da tabela.
   - Identifica "Finais" em caso de mata-mata.
   - Identifica partidas "HIGH" em retas finais de liga (ex: últimas 5 rodadas) se os dois times envolvidos estão nas posições de cima brigando por título ou de baixo brigando contra rebaixamento, e com pontuações próximas.
5. **Encerramentos:** 
   - `finishCompetition` decreta a finalização do campeonato, validando e registrando quem foi o campeão baseado na tabela final.
   - `finishSeason` força a finalização de todas as competições e encerra o ano corrente.
   - `generateSeasonSummary` emite um relatório final contendo o ano, os campeões e as tabelas, imutável.

## Arquitetura e Restrições
- **Funções Puras / Sem React:** O motor é 100% livre de efeitos colaterais. Ele recebe o estado anterior e devolve o novo estado, facilitando testes preditivos e compatibilidade com Redux.
- **Isolamento de Domínios:** Diferentemente de outros gerenciadores de temporada, este não mistura notícias e mercado de transferências nas suas responsabilidades. Seu foco é estritamente na engrenagem temporal das partidas.
- **Determinismo e IDs:** Gera IDs (`fix_comp_wX_TeamA_TeamB`) que garantem unicidade sem necessitar side-effects imprevisíveis. Em momentos onde aletasório é necessário para chaveamentos, uma `RandomSource` é aceita por injeção.

## Próximos Passos
- V1 suporta bem um "Brasileirão Série A" isolado.
- V2 focará na gestão de múltiplas competições interlaçadas e integração com as `Tasks` e o loop assíncrono do GameEngine V2.
