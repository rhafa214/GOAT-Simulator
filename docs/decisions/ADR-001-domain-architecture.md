# ADR-001: Arquitetura de Domínio e Separação de Responsabilidades

## Status
Aceito

## Contexto
Atualmente, o GOAT Simulator possui a lógica de simulação, regras de negócio e controle de estado fortemente acoplados no `GameEngine.tsx` e dentro de um grande `reducer`. Isso dificulta a testabilidade, causa bugs silenciosos (ex: partidas fantasmas) e impede que o jogo seja escalado de forma segura sem introduzir efeitos colaterais imprevistos. Precisamos de uma arquitetura que permita que as regras do jogo (Domínio) sejam isoladas, testáveis e agnósticas à tecnologia de UI (React).

## Decisão
Vamos adotar uma arquitetura baseada em princípios de *Domain-Driven Design (DDD)* e *Clean Architecture*, adaptada para a realidade de um jogo em React. A base de código será separada em camadas concêntricas:

1. **Domain (Domínio):** Onde habitam as regras puras do jogo. Sem dependências externas.
2. **Application (Aplicação):** Casos de uso e orquestração (comandos que modificam o estado passando pelo domínio).
3. **Infrastructure (Infraestrutura):** Implementações de serviços externos (RNG, IA, banco de dados estático).
4. **Presentation (Apresentação):** Componentes React, hooks, roteamento de telas e a UI em si.
5. **Game State:** Onde o estado do jogo é mantido e propagado para a Presentation. Continuaremos utilizando a Context API com `useReducer` para minimizar o atrito da migração, mas movendo a lógica complexa de dentro do reducer para casos de uso.

## Consequências
### Positivas
- **Alta testabilidade:** As regras de jogo (ex: como um atributo evolui após uma partida) poderão ser testadas isoladamente através de funções puras sem a necessidade do React Render Hook.
- **Previsibilidade:** Injeção de dependências (como RNG) permitirá simular cenários específicos.
- **Evolução Segura:** Será possível adicionar novos sistemas criando novos módulos no domínio, sem inchar o `advanceWeekLogic`.

### Negativas
- **Curva de Aprendizado:** Maior número de arquivos e estruturas formais.
- **Overhead Inicial:** Teremos que mover lógica e refatorar gradualmente o `GameEngine` para se tornar apenas um repositório de estado.

## Plano de Migração
A migração deve ser gradual:
1. Extrair lógica do `GameEngine` para módulos de domínio puros, injetando o estado antigo e retornando o novo.
2. Criar a camada Application (Casos de uso) para invocar os módulos do domínio.
3. O `reducer` do `GameEngine` passa a apenas chamar essas funções (ex: `AdvanceWeekUseCase(state, rng)`).
4. Não refatorar a interface gráfica nesta fase, apenas as importações necessárias.
