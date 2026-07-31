# Relatório de Caracterização e Testes

Este documento registra o estado atual do `GameEngine` através de testes de caracterização antes do início da refatoração.

## Comportamento Intencional
- **Fluxo de Tempo e Idade:** Após a semana 52, o ano é incrementado, a idade do jogador aumenta e as estatísticas da temporada são arquivadas.
- **Evolução de Atributos:** Durante as partidas, os atributos do jogador crescem de acordo com sua idade e performance. Jogadores com idade >= 32 sofrem decaimento gradual nos atributos físicos a cada partida.
- **Eventos:** Se a condição de um evento for cumprida (e ele for sorteado na roleta de raridades), a simulação da semana é interrompida (`phase: 'EVENT'`) para o jogador interagir.
- **Salário e Fama:** Salários são pagos semanalmente. Fama e moral sobem baseados no desempenho do jogador em campo (Gols, Melhor em Campo).

## Comportamento Duvidoso
- **Estado Inicial Sujo:** O `INITIAL_STATE` possui um `nextMatch` mockado (contra "Rival FC") que existe mesmo durante a criação do jogador. Ele acaba sendo sobrescrito pelo `SETUP_CAREER`, mas é conceitualmente incorreto.
- **Inconsistência de Datas no Log:** Na virada do ano (semana 52), o `id` gerado para a partida utiliza `nextYear` (ex: 2025), enquanto a propriedade `year` do próprio `matchLog` registra o ano anterior (ex: 2024).

## Bug Confirmado
- **Partida Fantasma por Cansaço:** Se a condição de aptidão física do jogador for muito baixa (`fitness <= 30`), a partida atual agendada não é simulada. O grande problema é que **nenhum registro de partida é criado** (nem mesmo indicando que o time jogou sem o jogador). A partida simplesmente desaparece do calendário sem deixar rastros no histórico do clube ou do jogador.

## Dívida Técnica
- **Monolito de Simulação:** O `advanceWeekLogic` possui quase 200 linhas de código altamente acoplado. Ele resolve economia, transição de temporada, geração de partidas, simulação em campo, cálculo de notas, evolução de atributos e eventos narrativos em um único escopo.
- **Baixa Testabilidade Original:** O uso de `Math.random` injetado diretamente nos cálculos exigiu a criação de um wrapper (`rng.ts`) para os testes funcionarem deterministicamente. As regras de negócio precisam ser separadas em funções puras (ex: `simulateMatch(player, club, opponent, rng)`).
