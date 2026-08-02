# GOAT VISUAL BIBLE — Guia Oficial da Identidade Visual

## 1. Visão Geral e Filosofia de Design

A **GOAT Visual Bible** estabelece a linguagem visual e os padrões de interface definitivos para o **GOAT Simulator**. A direção estética foi concebida para evocar a atmosfera imersiva, elegante e emocionante de uma **transmissão esportiva de elite (Broadcast Standard)** e de um **diário de um atleta lendário**, afastando-se do visual administrativo B2B/SaaS e de temas azuis genéricos.

### Diretrizes Inegociáveis:
* **Pitch Black & GOAT Gold:** Fundo preto puro (`#000000`) combinando superfícies minerais com toques estratégicos de Ouro Âmbar (`#F59E0B`).
* **Broadcast Atmosphere:** Grafismos oblíquos, tipografia condensada de alto impacto visual e cards estruturados como figurinhas/placas de gala.
* **Emocionante & Relevante:** Foco no Overall (`GER`), estatísticas vivas, títulos e legado do futebolista.

---

## 2. Marca e Identidade Conceitual

* **Logotipo Conceitual:** "GOAT SIMULATOR — O FENÔMENO". Tipografia em caixa alta, condensada, em tom Ouro Âmbar com bisel mineral e leve corte oblíquo (`skew-x-[-6deg]`).
* **Símbolo:** A silhueta estilizada de uma cabra dourada integrada a uma estrela de campeão de 5 pontas, encimando a numeração do jogador.
* **Linguagem Verbal da UI:** Termos diretos do universo esportivo (ex: *Próximo Desafio*, *Janela Decisiva*, *Gala de Premiação*, *Legado Imortal*).

---

## 3. Paleta de Cores e Tokens de Cor

```json
{
  "colors": {
    "background": {
      "pitch": "#000000",
      "stadium": "#09090B",
      "surface": "#121215",
      "surfaceElevated": "#18181B"
    },
    "brand": {
      "gold": "#F59E0B",
      "goldHover": "#D97706",
      "goldLight": "#FCD34D",
      "goldGlow": "rgba(245, 158, 11, 0.25)"
    },
    "state": {
      "victory": "#10B981",
      "defeat": "#EF4444",
      "draw": "#38BDF8",
      "injury": "#F43F5E",
      "warning": "#F59E0B",
      "info": "#0EA5E9"
    },
    "neutral": {
      "white": "#FAFAFA",
      "gray100": "#F4F4F5",
      "gray400": "#A1A1AA",
      "gray700": "#3F3F46",
      "gray800": "#27272A",
      "gray900": "#18181B"
    }
  }
}
```

---

## 4. Tipografia e Compatibilidade de Fontes

Para garantir que o jogo nunca quebre por falhas de rede ou bloqueio de CDN:

* **Títulos, Overalls & Plamares (Display):**
  * Primária: `Bebas Neue`, `Oswald` (Google Fonts)
  * Fallbacks Locais / Web-Safe: `Impact`, `Arial Narrow`, `Trebuchet MS`, `sans-serif`
* **Corpo de Texto, Menus e Tabelas (Body):**
  * Primária: `Plus Jakarta Sans`, `Inter`
  * Fallbacks Locais / Web-Safe: `system-ui`, `-apple-system`, `Segoe UI`, `Roboto`, `Helvetica`, `Arial`, `sans-serif`
* **Código e Estatísticas Técnicas (Mono):**
  * Primária: `JetBrains Mono`, `Fira Code`
  * Fallbacks Locais: `ui-monospace`, `Courier New`, `monospace`

---

## 5. Espaçamento, Bordas e Elevadores (Grid System)

* **Espaçamento Modular:** 4px (`p-1`), 8px (`p-2`), 12px (`p-3`), 16px (`p-4`), 24px (`p-6`), 32px (`p-8`).
* **Bordas (Radius):**
  * Cards e Modais: `rounded-2xl` (16px)
  * Botões e Pílulas: `rounded-lg` (8px) / `rounded-full` (pílula)
* **Grafismos Oblíquos:** Traços com inclinação `-skew-x-6` ou `-skew-x-12` em badges esportivas e headers de competição.

---

## 6. Sombras, Luzes e Micro-interações

* **Sombras:** `shadow-2xl` enriquecidas com `ring-1 ring-white/10`.
* **Gold Glow Effect:** Borda ativada `ring-2 ring-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]`.
* **Motion & Reduced Motion:**
  * Transições padrão: `duration-200 ease-out`.
  * Suporte total a `@media (prefers-reduced-motion: reduce)` via utilitários `motion-reduce:transition-none`.

---

## 7. Estilo dos Componentes de Interface

### 7.1 GoatCard
Card com fundo escuro mineral (`bg-zinc-950/80`), borda de vidro (`border-zinc-800/80`) e suporte a variantes de destaque Ouro, Vitória ou Perigo.

### 7.2 GoatButton
Botão tátil responsivo com suporte a variantes `primary` (GOAT Gold), `secondary` (Mineral Glass), `ghost` e `danger`. Inclui estados ativados de `loading` (spinner embutido) e `disabled`.

### 7.3 GoatBadge
Pílula de indicador de status tático (Vitória, Derrota, Lesão, Destaque Gold) com texto legível e suporte a contraste A11Y.

### 7.4 GoatStatHeader
Cabeçalho de estatística com Overall (`GER`) grande, rótulo descritivo e indicador de tendência tática.

### 7.5 GoatModal
Modal modalitário responsivo preparado para telas mobile de 360px a desktops 1920px, com backdrop escuro, animação de entrada e suporte a fechar por tecla `ESC` ou clique externo.

### 7.6 GoatNumberCounter
Componente de contagem numérica animada (Count-up) com formatação de valores financeiros e pontuações de atributos.

---

## 8. Garantia de Acessibilidade (A11Y)

1. **Área de Toque Mínima:** Todos os elementos interativos possuem no mínimo `44px x 44px` de área clicável em mobile.
2. **Anéis de Foco Teclado:** Utilização obrigatória de `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400`.
3. **Contraste WCAG AA:** O texto branco (`#FAFAFA`) e dourado escuro sobre superfícies pretas/minerais atende à taxa de contraste mínima de 4.5:1.
