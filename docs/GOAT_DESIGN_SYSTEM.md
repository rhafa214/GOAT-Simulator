# GOAT Simulator — Design System

## Introdução
O GOAT Design System é focado em entregar uma interface imersiva, moderna e responsiva, com forte inspiração em padrões premium (Apple/PS5). A identidade usa alto contraste (modo escuro por padrão) e paletas em tons de ouro para simbolizar excelência.

## Cores
- **Background**: Base em `#000000` absoluto com painéis de elevação `#09090B` e `#18181B`.
- **Primary (Accent)**: `#EAB308` (Yellow 500). Usado para destaques, barras de progresso, ícones ativos e glows.
- **Secondary**: `#F97316` (Orange 500). Usado em gradientes junto com o Primary.
- **Textos**: Brancos (`#FAFAFA`) para texto primário, e cinzas (`#A1A1AA`) para informações secundárias.

## Tipografia
- Fontes de sistema modernas e minimalistas (Inter, San Francisco, Helvetica).
- Pesos:
  - Textos normais: `400`
  - Botões e tags: `500` / `700`
  - Títulos principais: `900` (Black)

## Componentes

### Botões (`GoatButton`)
- Devem ter bordas e fundos minimalistas quando inativos.
- Ao receber foco/hover, utilizar transições suaves (`0.3s`).
- Botões primários usam fundo na cor primária com texto contrastante (preto).

### Cards (`GoatCard`)
- Fundo em cinza escuro (`#18181B`).
- Bordas sutis (`#27272A`) ou `#3F3F46` no hover.
- Radius consistente (mínimo `12px` / `0.75rem`).
- Sombras internas fracas ou uso de glow/blur em itens raros/destaque.

### Sombras e Glow
- Glow em componentes selecionados/especiais: `0 0 20px rgba(234, 179, 8, 0.15)`.

## Boas Práticas
- Evitar fundos totalmente cinzas para a tela principal (sempre preto).
- Evitar muitas cores distintas; manter status (verde, vermelho) apenas para feedbacks concretos.
- Todo novo componente de UI (ex: modais, headers, sliders) deve consultar `src/core/constants/designSystem.ts`.
