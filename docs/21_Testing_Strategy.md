# Estratégia de Testes

## Objetivo

Garantir estabilidade do GOAT Simulator em React, com Vite e TypeScript, através de uma infraestrutura leve, rápida e coesa.

## Stack

- **Vitest:** Test runner rápido e nativo do Vite.
- **React Testing Library:** Testes comportamentais e renderização de componentes.
- **jsdom:** Simulação do ambiente de browser.
- **@testing-library/jest-dom:** Matchers amigáveis e assertivos.

## Estrutura de Diretórios

- Os testes unitários ficam no diretório `src/__tests__`.
- O arquivo de setup `src/test/setup.ts` importa configurações globais (ex. jest-dom).

## Scripts

- `npm run test`: Abre o ambiente interativo de testes (watch mode) do Vitest.
- `npm run test:run`: Executa os testes de forma automatizada sem ambiente iterativo (útil em CI).
- `npm run test:coverage`: Exibe e gera as métricas de cobertura.

## Princípios

1. **Evitar Snapshots:** Focar mais em queries comportamentais e asserções específicas ao invés de usar snapshots grandes que quebram facilmente.
2. **Separação de Preocupações:** Testes do GameEngine focarão no `reducer` ou hooks sem atar à UI. Testes de interface testam fluxo (ex. FlowController) e preenchimento de inputs.
3. **Mocks Mínimos:** Somente o necessário para o jsdom não quebrar (ex. `ResizeObserver`, `matchMedia`).
4. **Sem Efeitos Colaterais:** Cada teste de GameEngine deve utilizar uma `GameProvider` recém inicializada.
