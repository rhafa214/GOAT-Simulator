# 05. Telas e Componentes

## 1. Descrição das Telas Principais

### A. Tela de Criação de Personagem (Creation Screen)
*   **Propósito:** Primeira tela que o jogador vê. Define o "Avatar".
*   **Composição:** Nome, Posição, Distribuição de Pontos Iniciais de Atributos (Sistema de "Roll" ou alocação).
*   **Estado Final:** Injeta os dados base no motor do jogo e transita para o Hub.

### B. O "Hub" Principal (MainHub)
*   **Propósito:** Central de controle da carreira. Uma single-page layout sem reloads.
*   **Navegação:** Sidebar com links para as abas internas (Dashboard, Estatísticas, Atributos, Notícias).
*   **Componente Global:** O Avatar/Perfil 3D do jogador fica fixo (geralmente à esquerda ou no topo) para manter o senso de identidade e moral/energia constantemente visíveis.

### C. Aba 1: DashboardView (Resumo)
*   **Propósito:** O pulso da semana. Onde o jogador clica "Avançar Semana".
*   **Elementos:** Card do Próximo Jogo, Relatório do Último Jogo (Gols, Assistências), Status Físico e Botão de Simulação.

### D. Aba 2: StatsView (Estatísticas e Troféus)
*   **Propósito:** Visualizar a grandiosidade da carreira a longo prazo.
*   **Elementos:** Sala de Troféus (Bolas de Ouro, Chuteiras), Histórico de Transferências, Tabela Temporada a Temporada (Clubes vs Gols vs Notas).

### E. Aba 3: AttributesView (Desempenho e Treino)
*   **Propósito:** Entender as fortalezas e fraquezas do jogador.
*   **Elementos:** Gráfico Radar interativo (Chart.js), Barras de Nível de cada atributo (Finalização, Passe, etc.), Painel de Foco de Treino.

### F. Aba 4: NewsFeedTab (Imersão IA)
*   **Propósito:** Gerar engajamento e surpresa. Lida com a API da OpenAI.
*   **Elementos:** Layout imitando uma revista esportiva digital. Parágrafos textuais dramáticos focando nos eventos recentes simulados pelo motor de jogo.

---
**Status Atual:** Concluído.
**Próximo Passo Planejado:** Criação do Design System.
