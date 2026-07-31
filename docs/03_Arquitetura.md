# 03. Arquitetura do Sistema

## 1. Visão Geral (Full-stack)
A aplicação utiliza uma arquitetura Full-stack acoplada em um monorepo via Vite, separando logicamente as responsabilidades do Front-end (React) e Back-end (Express Node.js).

## 2. Camada de Apresentação (Front-end / React)
A UI é construída utilizando componentização modular:
*   **Controle de Estado Global:** `GameEngineContext` (React Context + `useReducer`). Toda a lógica do jogo (avançar semana, gerar partidas, transferências) vive puramente em redutores (`playerReducer`, `careerReducer`), o que facilita testes unitários e previsibilidade.
*   **Roteamento Interno (Hub):** Um componente principal `MainHub` orquestra "Abas" virtuais (Dashboard, Estatísticas, Atributos, Notícias), evitando carregamentos de página completa e preservando as animações.
*   **Visualização Gráfica:** `Chart.js` via `react-chartjs-2` isolado no componente `AttributesView` para o Radar de status.
*   **Imersão 3D:** Componente isolado `ThreeDElement` gerenciando o Canvas do `@react-three/fiber` sem bloquear a renderização síncrona dos dados textuais.

## 3. Camada de Aplicação (Back-end / Express)
O arquivo `server.ts` age como o núcleo do Back-end.
*   **API Routes (`/api/*`):** Endpoints REST para comunicação segura.
*   **Isolamento de Credenciais:** As chaves (OpenAI, Gemini, Supabase, Prisma) não são exportadas para o Vite. Ficam restritas ao ambiente Node.js.
*   **Serviços de IA:** Uma rota `/api/generate` abstrai qual provedor está sendo usado, aceitando um payload genérico e retornando o texto.

## 4. Camada de Dados (Supabase / Prisma)
O ORM Prisma gerencia o modelo relacional de forma tipada, operando em cima do PostgreSQL fornecido pelo Supabase.
*   **Comunicação:** O Express faz as requisições ao banco utilizando o Prisma Client. O React nunca fala diretamente com o banco.
*   **Persistência (Planejamento):** Saves do jogo serão enviados via POST `/api/save` comprimindo o JSON do Contexto do React e armazenando como um binário/JSONB ou registro relacional no PostgreSQL.

## 5. Fluxo de Dados (Diagrama Lógico)
1. **User Action:** Clica em "Simular Semana" no React.
2. **State Mutation:** O `useReducer` calcula resultados, gols, lesões.
3. **Trigger IA:** O Contexto dispara um `useEffect` (ou uma chamada async direta) chamando `fetch('/api/generate')`.
4. **Backend:** Express recebe, formata o prompt, manda pra OpenAI. Retorna a resposta para o React.
5. **UI Update:** React re-renderiza o Dashboard e Feed de Notícias.
6. **Autosave (Futuro):** Express chama `prisma.saveGame.upsert(...)` para manter o progresso no Supabase.

---
**Status Atual:** Concluído.
**Próximo Passo Planejado:** Modelagem de Banco de Dados.
