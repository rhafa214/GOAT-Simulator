# 10. Descrição de Telas e Fluxos

## 1. Visão Geral
Com a arquitetura do **Football Database Engine** definida, a interface do usuário (UI) precisará ser rica, responsiva e capaz de exibir milhares de dados sem travar. O jogo não tem telas de carregamento longas, e a navegação deve ser fluida como em um sistema operacional (estilo Football Manager).

## 2. Fluxo Principal de Jogo (Game Loop)
1. **Criação de Avatar:** Onde o usuário define quem ele é.
2. **Dashboard (Hub Central):** A tela principal onde o jogador passa a maior parte do tempo, avançando o calendário.
3. **Caixa de Entrada (Inbox):** Onde os eventos acontecem e o jogo se comunica com o usuário.
4. **Motor de Partida (Match View):** O momento em que o calendário pausa para um jogo importante.
5. **Mercado e Base de Dados (Scouting):** Onde o usuário interage com o universo do jogo (outros clubes, jogadores, rankings).

---

## 3. Descrição Detalhada das Telas

### 3.1. Hub Central (Dashboard)
A tela mais crítica do jogo. Deve passar a sensação de urgência e progresso.
*   **Header (Cabeçalho):** Nome do jogador, clube atual, barra de progresso da temporada, dinheiro em conta e o botão principal "AVANÇAR".
*   **Painel Principal:** Visão geral do próximo adversário, probabilidade de vitória, estatísticas da temporada atual e a moral da diretoria.
*   **Painel Lateral (Quick Status):**
    *   Nível de Energia (Fitness).
    *   Classificação atual da Liga (Tabela Resumida - Top 5).
    *   Evolução de Atributos recentes (setas verdes apontando para cima).
*   **Ação Principal:** O botão "Continuar" que aciona o motor para simular dias até o próximo evento (Partida, Oferta de Transferência, Notícia Urgente).

### 3.2. Caixa de Entrada (Inbox / News)
A ponte de comunicação narrativa.
*   **Layout:** Estilo e-mail. Lista de mensagens à esquerda, corpo da mensagem à direita.
*   **Tipos de Mensagens:**
    *   **Informativas:** Relatório pós-jogo, lesões em outros clubes, sorteio da Champions League.
    *   **Interativas (Decisões):** Oferta de contrato (Aceitar/Recusar/Negociar), convocação para seleção, coletiva de imprensa (opções de resposta que afetam moral).
*   **UX:** O jogo pausa quando há uma mensagem vermelha (Urgente/Must-respond).

### 3.3. Perfil do Jogador (O "Eu")
A vitrine do ego do jogador.
*   **Radar Chart (Atributos):** Gráfico hexagonal mostrando os stats principais (PAC, SHO, PAS, DRI, DEF, PHY).
*   **Contrato Atual:** Salário semanal, tempo restante, valor de mercado estimado, cláusula de rescisão.
*   **Histórico de Carreira:** Uma tabela listando todas as temporadas (Ano, Clube, Jogos, Gols, Assistências, Nota Média). Consultará a tabela `player_season_stats` de forma rápida.
*   **Sala de Troféus (Cabinet):** Visualização 3D ou ícones com badges de conquistas (Bolas de Ouro, Copas, Ligas).

### 3.4. Visão do Clube (O Empregador)
Onde o jogador acompanha o status do time que defende.
*   **Visão Geral:** Informações do Clube, Estádio, Reputação Mundial e Saldo Bancário.
*   **Tática e Elenco (Squad):** Lista dos companheiros de equipe, incluindo o próprio jogador. Ordenável por Posição, Overall e Idade (consumindo a tabela `players` vinculada ao `club_id`).
*   **Departamento Médico:** Quem está machucado no time e por quanto tempo.
*   **Confiança da Diretoria:** Gráfico mostrando se estão satisfeitos com o rendimento do avatar.

### 3.5. Mundo e Competições (Database View)
O explorador do Football Database Engine.
*   **Ligas:** Tabelas de classificação, artilharia, líderes em assistência.
*   **Busca de Jogadores:** Filtros (Idade, Posição, Nacionalidade, Overall). Como os dados estão locais via SQLite WASM, buscar entre 10.000 jogadores será instantâneo.
*   **Rankings:** Quem é o melhor time do mundo? Quem lidera o coeficiente de países?

### 3.6. Motor de Partida (Match Experience)
A tela de simulação quando um jogo ocorre.
*   **Layout:** Visão dividida. Campo tático/gráfico em cima, comentários em texto embaixo.
*   **Destaque (Highlights):** Ao invés de assistir a 90 minutos lentos, o jogo mostra uma barra de tempo que avança rápido, pausando e focando apenas quando ocorre uma jogada perigosa envolvendo o avatar.
*   **Estatísticas em Tempo Real:** Posse de bola, finalizações, nota (rating) momentânea do jogador em campo (ex: 7.5).
*   **Ações In-Match:** Se o avatar tiver a bola, podem surgir Quick Time Events táticos ("Você está frente a frente com o goleiro: Chutar Forte / Tentar Cobertura / Tocar pro lado").

## 4. Navegação e Arquitetura de UI
*   **Side Navigation (Nav Bar):** Ícones fixos à esquerda ou rodapé (Home, Perfil, Clube, Mundo, Inbox).
*   **Modais / Overlays:** Para visualização rápida do perfil de outros jogadores, usar pop-ups (modais) para não quebrar o fluxo de navegação do usuário.
*   **Transições:** Usar animações fluidas (`framer-motion` / `motion`) entre telas para criar a sensação de um "app" nativo, não de um site que recarrega.

## 5. Próximo Passo
Com os fluxos de tela mapeados, precisamos agora da **Descrição dos Componentes**, que listará as peças de Lego reutilizáveis (Botões de atributos, Cartões de Jogador, Tabelas de Liga) para construir essa interface de forma escalável em React.
