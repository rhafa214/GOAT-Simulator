# 01. Análise Técnica Completa

## Visão Geral do Projeto
O projeto trata-se de um "Simulador de Carreira de Jogador de Futebol (GOAT Simulator)". O objetivo é simular a progressão de um atleta desde as categorias de base até o estrelato, utilizando mecânicas de RPG (atributos, moral, condicionamento), relatórios gerados por IA, interface 3D interativa e gráficos de desempenho.

## Stack Tecnológico Escolhido e Justificativa

*   **Front-end:** React 19 + TypeScript + Vite. Escolhido pela alta reatividade, ecossistema gigante e tipagem forte que previne erros no longo prazo.
*   **Estilização:** Tailwind CSS + Framer Motion. Tailwind permite construção rápida e customizada sem arquivos CSS extras. Framer Motion é o padrão ouro para animações fluidas em React.
*   **Back-end:** Express (Node.js) embutido no Vite via configuração Full-stack `server.ts`. Arquitetura modular escolhida para separar as responsabilidades e garantir segurança das chaves de API.
*   **Banco de Dados & ORM:** PostgreSQL hospedado no Supabase + Prisma. Supabase oferece um backend escalável (BaaS) com features de autenticação no futuro. Prisma garante type-safety nas queries.
*   **Inteligência Artificial:** OpenAI API integrada no back-end para geração de feed de notícias dinâmico e comentários das partidas (fallback para Gemini).
*   **Gráficos e Visualização:** Chart.js (React-chartjs-2) para exibir radares de atributos do jogador, e Three.js (React Three Fiber / Drei) para elementos 3D imersivos na UI (ex: esferas e cenários visuais abstratos).

## Requisitos Não Funcionais (Arquitetura e Código)
1.  **Arquitetura Modular:** Separação clara entre camada de UI (Componentes), camada de regras de jogo (GameEngineContext/Reducers), camada de API externa e banco de dados.
2.  **Código Limpo:** Padrões de design aplicados (ex: Hooks customizados para regras de negócio), linting e tipagem estrita no TypeScript.
3.  **Escalabilidade:** Uso do Prisma permite escalar a modelagem do banco facilmente através de migrations. Uso de módulos isolados permite escalar features sem quebrar módulos existentes.

## Pontos de Atenção & Riscos
*   **Sincronização Estado Local vs Banco:** O jogo roda altamente dependente do estado local (GameEngine). A estratégia de save/load (sincronização com Supabase/Prisma) precisará ser bem desenhada para evitar perda de dados.
*   **Custos de IA:** Geração constante de notícias com IA pode gerar latência e custo. Necessidade de usar prompts eficientes e caching.
*   **Performance 3D:** Three.js pode ser pesado. Necessário uso cuidadoso de hooks (ex: `useFrame`) e carregamento de modelos leves para não afetar a fluidez do Dashboard.

---
**Status Atual:** Concluído.
**Próximo Passo Planejado:** Elaborar o Game Design Document (GDD).
