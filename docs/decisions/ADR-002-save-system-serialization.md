# ADR 002: Save System e Serialização do Estado

## Contexto
O jogo precisa de um sistema de Save/Load robusto baseado no \`localStorage\`. O problema crítico encontrado foi que o \`GameState\` continha instâncias de funções (especificamente definições de \`GameEvent\` no array \`activeEvents\`), o que impede a serialização correta usando \`JSON.stringify()\` ou o armazenamento persistente em disco.

## Decisão
Foi decidido refatorar o \`GameState\` para conter apenas propriedades puramente seralizáveis.

- **Separação Estado vs Lógica:** Em vez de manter o objeto completo \`GameEvent\` no \`GameState.narrative.activeEvents\`, passamos a armazenar apenas o \`eventId\` (\`string[]\`).
- **Resolução Estática:** Os eventos completos são recuperados dinamicamente do catálogo estático \`GAME_EVENTS\` (em \`src/data/events.ts\`) durante a execução, quando o jogador precisa visualizar e tomar uma decisão sobre a narrativa.
- **Camada de Validação em Runtime:** A integridade dos dados durante o Load e a Importação de arquivos JSON é garantida por meio do \`SaveGameService\`, validando propriedades aninhadas e versionando o schema sem depender do uso inseguro do tipo \`any\`.

## Consequências
- \`GameState\` é 100% livre de funções.
- \`JSON.stringify()\` e \`JSON.parse()\` atuam com segurança no Save e Load.
- Refatoramos \`advanceWeek.ts\` e \`resolveEvent.ts\` para lidar apenas com identificadores (IDs).
- O sistema ganhou uma infraestrutura nativa para Exportar e Importar Saves com suporte a detecção e rejeição de saves corrompidos.
