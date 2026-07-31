# 11. Descrição de Componentes (React)

## 1. Visão Geral
A UI do jogo será construída com base na atomicidade. Isso significa peças pequenas, independentes e altamente reutilizáveis que reagem ao estado global do `GameEngine` ou a consultas ao banco de dados SQLite WASM.

## 2. Componentes Estruturais (Layout)
*   **`LayoutCentral`**: O wrapper principal (HOC) que define o limite da tela, cores de fundo dinâmicas (ex: mudar o tema baseado nas cores do clube atual do jogador) e injeta a Barra de Navegação.
*   **`Sidebar` / `BottomNav`**: Componente de navegação. Esconde textos e vira uma barra de ícones em dispositivos móveis.
*   **`HeaderStatus`**: O cabeçalho sempre visível com as barras vitais (Energia, Moral) e o botão mestre de `Avançar o Tempo`.

## 3. Componentes de Dados (Football Database)
Componentes que consomem o banco diretamente ou via adaptadores:
*   **`PlayerCard`**: Um bloco retangular ou "carta" (inspirado em Ultimate Team) mostrando foto (gerada), Overall, Nacionalidade e Bandeira.
    *   *Props:* `playerId`, `showStats`, `theme`.
*   **`ClubBadge`**: Escudo do clube. Se o clube for real, renderiza o logo (mock) ou as iniciais com as cores primárias/secundárias extraídas do DB.
    *   *Props:* `clubId`, `size`.
*   **`StandingsTable`**: Tabela de classificação.
    *   *Props:* `competitionId`, `seasonId`. Exibe P, V, E, D, GF, GC, SG e Pontos. Highlight visual na linha do clube do usuário.
*   **`AttributeHexagon`**: Gráfico Radar gerado via Chart.js ou puramente SVG.
    *   *Props:* `attributes` (PAC, SHO, PAS, DRI, DEF, PHY).

## 4. Componentes Interativos e de Ação
*   **`AdvanceButton`**: O botão de simulação. Muda de estado (`Simulando...`, `Parar`, `Continuar`) dependendo da flag do loop do motor.
*   **`DecisionPrompt`**: Modal focado. Usado para negociações de contrato ou interações com a imprensa. Força uma escolha.
*   **`StatBar`**: Barra de progresso horizontal colorida (Vermelho < 50, Amarelo 50-75, Verde > 75) para exibir atributos físicos ou energia.

## 5. Próximo Passo
Com os componentes definidos, a última etapa de planejamento antes de voltarmos ao código é o **Design System**, onde definiremos a paleta de cores, tipografia, espaçamentos e a estética geral (UI/UX) do simulador.


## Refatoração de Avatares (2026-07-31)
Os componentes responsáveis por renderizar e orquestrar o avatar 3D foram refatorados para nomes inequívocos e responsabilidades mais claras:
- **AvatarScene**: (antigo `PlayerAvatar.tsx` 3D) Responsável pelo Canvas Three.js, luzes, câmera e setup do ambiente 3D.
- **AvatarModel**: (inalterado) Responsável apenas por carregar a malha e animações do modelo ou um fallback procedural.
- **PlayerPortrait**: (antigo `PlayerAvatar.tsx` UI) Um wrapper React que usa os dados do jogador atual (state) e injeta como props para o `AvatarScene`. É o componente que deve ser importado pelas telas.
- O arquivo `AvatarManager.tsx` foi removido por ser inútil e causar confusão no controle de estado, que agora flui naturalmente por props desde o `GameEngine`.
