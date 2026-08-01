# Feature 003: Career Hub

## 1. Visão Geral
O Career Hub é o centro nevrálgico da carreira do jogador. Ele deve responder imediatamente às seguintes perguntas críticas, sem que o usuário precise navegar ou procurar:
- Quem sou?
- Onde jogo?
- Como estou?
- Qual é o próximo desafio?
- O que mudou no mundo?
- O que preciso decidir agora?
- Qual é o meu progresso rumo ao status de GOAT?

## 2. Informações Prioritárias
A interface deve organizar e apresentar os seguintes dados de forma hierárquica e elegante:
*   **Identidade:** Avatar (3D ou Retrato), Nome, Idade, Posição, Overall (GER).
*   **Contexto de Clube:** Escudo do Clube, Nome do Clube, Número da Camisa.
*   **Contexto de Tempo:** Temporada Atual, Data (Semana/Ano).
*   **Condição Atual:** Moral (ícones/texto), Fitness (barra de energia), Forma (Física/Técnica).
*   **Calendário & Desafios:** Próximo Jogo (Adversário, Competição, Local), Importância do Jogo, Objetivos da Partida.
*   **Desempenho:** Últimos Resultados, Estatísticas da Temporada atual.
*   **Mundo & Eventos:** Notícias do campeonato, Alertas (Lesões, Transferências), Eventos Urgentes pendentes.
*   **Ações:** Controles de Simulação (Avançar Semana, Jogar Partida/Treinar).

## 3. Hierarquia Visual e Responsividade

A exibição deve ser modular para evitar sobrecarga cognitiva, não colocando tudo simultaneamente na tela.

### 3.1. Desktop (Grid Complexo e Imersivo)
- **Painel Principal (Esquerda):** Grande destaque para o Avatar, Nome, Overall, Clube e Status Físico/Moral. Funciona como a "Capa da Revista".
- **Top Bar (Cabeçalho):** Data, Temporada, e Progresso GOAT.
- **Painel Central/Direito (Foco de Ação):** Card detalhado do "Próximo Desafio", objetivos e botão principal de simulação.
- **Painel Inferior/Lateral Auxiliar:** Abas alternáveis para Estatísticas, Notícias e Histórico recente.

### 3.2. Tablet (Duas Colunas / Stack)
- **Topo:** Header compacto.
- **Corpo Superior:** Avatar e Informações Básicas dividindo espaço com o Próximo Jogo.
- **Abaixo da Dobra:** Notícias e Estatísticas agrupadas em um layout de abas ou painéis de rolagem horizontal.

### 3.3. Celular (Coluna Única e Objetiva)
- Tudo organizado em formato *Stack* vertical (rolagem contínua).
- O Avatar fica no topo.
- Ações primárias (Avançar/Jogar) devem ser *sticky* na parte inferior (Bottom Action Bar).
- Contextos secundários (Notícias, Últimos Jogos) usam rolagem horizontal interna (carrossel) para poupar espaço vertical.

## 4. Wireframe Textual (Abstração Estrutural)

```text
========================================================================
[ HEADER ] Data: Sem 14, 2024 | Temporada 1 | Nível GOAT: 20%
========================================================================
[ COLUNA 1: IDENTIDADE ]        [ COLUNA 2: AÇÃO & CONTEXTO ]
                                
  (Avatar 3D)                   +----------------------------------+
                                | PRÓXIMO JOGO                     |
  L. MESSI                      | vs Real Madrid (Fora)            |
  [ CAM 10 ] [ GER 92 ]         | Importância: Alta (Derby)        |
  Paris SG                      +----------------------------------+
                                | CONDIÇÃO                         |
  [==== Fitness: 90% ]          | Moral: Excelente                 |
                                | Forma: Em Alta (⬆)               |
                                +----------------------------------+
                                
[ COLUNA 1B: ALERTAS ]          [ COLUNA 2B: ABASECUNDÁRIA ]
+----------------------+        +----------------------------------+
| ⚠️ Evento Pendente    |        | [Tabs: Notícias | Estatísticas]  |
| Contrato expirando   |        | - O time venceu a última rodada  |
+----------------------+        | - Gols na temporada: 12          |
                                +----------------------------------+
========================================================================
[ BOTTOM BAR ]                  [ AVANÇAR SEMANA / JOGAR PARTIDA ]
========================================================================
```

## 5. Estados da Tela

- **Loading:** Utilização de `Skeleton` screens para Avatar, Cards de Informação e Notícias, mantendo a estrutura visual intacta antes dos dados chegarem.
- **Erro:** `ErrorState` modular. Se falhar ao carregar notícias, apenas o módulo de notícias exibe erro; a simulação principal continua operante.
- **Default (Pré-Jogo):** Exibe o oponente, local e objetivos da próxima partida.
- **Sem Partida (Semana Livre):** Card de próximo jogo indica "Semana Livre". Foco visual muda para Treinamento, Descanso ou Eventos Sociais.
- **Entre Temporadas:** Controles de simulação pausados ou alterados para "Avançar Férias". Foco em Revisão da Temporada e Janela de Transferências.
- **Lesionado:** Mudança visual drástica (Avatar com overlay vermelho/desbotado, stat de Fitness quebrado), alerta crítico de "X Semanas para Retorno", e ação de "Jogar" desabilitada/substituída por "Recuperar".
- **Transferência Pendente:** Alerta urgente dourado/âmbar. Próximo jogo é minimizado ou substituído pelo painel de "Decisão de Contrato".
- **Evento Urgente:** Um alerta ou Modal bloqueia a simulação (Avançar Semana fica *disabled* ou muda a ação para "Resolver Pendência") até que a decisão seja tomada.

## 6. Componentes Previstos (Baseados no Design System V2)

- `<PlayerIdentityCard>`: Combina Avatar, Nome, Clube, GER e Posição.
- `<ConditionPanel>`: Usa `<Progress>` para Fitness e Ícones para Moral/Forma.
- `<NextMatchCard>`: Card contendo oponente, escudo, data e local.
- `<ActionDock>` / `<SimulationControls>`: Área *sticky* com `<Button variant="primary" size="lg">`.
- `<NewsWidget>`: Usa `<Tabs>` para agrupar Notícias do Mundo e Status da Liga.
- `<AlertBanner>`: Avisos de alta prioridade com o componente `<Toast>` fixo ou faixas coloridas.

## 7. Navegação

O Hub é a âncora da aplicação.
- A navegação global (Bottom Bar ou Sidebar Oculta) conecta o Hub à:
  - Perfil Completo (Atributos detalhados, Árvore de Habilidades).
  - Liga (Tabelas, Artilharia).
  - Museu (Troféus, Recordes).
  - Mercado (Apenas se janela aberta).

## 8. Acessibilidade

- **Contraste:** Conformidade WCAG AA. Texto branco sobre fundo preto para leitura fluida de Stats e Nomes.
- **Leitores de Tela (Aria):** Ao abrir o Hub, o foco inicial deve anunciar uma síntese (ex: "Você é Lionel, camisa 10 do Paris. Próximo jogo contra o Real Madrid.").
- **Reduced Motion:** Se ativado no SO, o avatar 3D não gira e as transições de painéis (fade, slide) são desativadas.
- **Navegação por Teclado:** A ordem de `tabindex` deve fluir do Header para a Ação Principal, depois para as Informações Vitais.

## 9. Critérios de Aceitação

1. **Reconhecimento Imediato:** O usuário consegue identificar seu Overall, Clube e oponente do próximo jogo em menos de 2 segundos, sem necessidade de rolagem em Desktop.
2. **Bloqueio Contextual:** A ação de "Avançar Semana" deve estar indisponível se houver um Evento Urgente ou Decisão de Transferência aguardando.
3. **Estado de Lesão:** O sistema não pode permitir jogar partida quando o jogador está lesionado, refletindo a UI com clareza.
4. **Responsividade:** O layout não quebra em telas de 320px e aproveita espaços em telas *ultrawide*, rearranjando colunas para *stacks* no mobile.
5. **Estética GOAT (V2):** Rigoroso uso de superfícies escuras, bordas finas, e o Dourado/Âmbar restrito às ações primárias e destaques de conquistas (fuga do visual de "software administrativo").
