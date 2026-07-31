# 06. Design System

## 1. Identidade Visual (Look & Feel)
**Tema Geral:** Escuro, Tecnológico, Premium, Neomorfismo Sutil ("Glassmorphism").
**Motivo:** Simula uma interface de "Manager" moderna, luxuosa, de alto rendimento. Evita o branco padrão cansativo para jogos baseados em texto.

## 2. Cores Principais (Tailwind Palette)
*   **Background:** Preto profundo/Zinc (`bg-zinc-950`).
*   **Superfícies (Cards):** Vidro / translúcido (`bg-white/5`, `backdrop-blur-3xl`).
*   **Bordas:** Brilho muito sutil (`border-white/10`).
*   **Primária (Destaque/Dinheiro/Vitória):** Verde vibrante (`text-green-500`).
*   **Secundária (Estrelato/Prêmios):** Amarelo Ouro/Ouro velho (`text-yellow-500`).
*   **Terciária (Neutro/Texto secundário):** Cinza metálico (`text-zinc-400`, `text-zinc-500`).
*   **Alerta/Fadiga:** Vermelho (`text-red-500`).

## 3. Tipografia
*   **Fonte Principal:** Inter ou Roboto (padrão de sistema limpo).
*   **Pesos:** 
    *   `font-black` (900) para números grandes (Gols, Notas, Overall) - Cria peso visual de pontuação.
    *   `font-bold` para cabeçalhos de cards.
    *   `font-normal` para textos gerais e notícias.
*   **Técnicas de Styling:** Uso pesado de `uppercase` e `tracking-widest` (letter-spacing) para criar um visual sofisticado de revista/dashboard.

## 4. Padrões de Layout e Componentes
*   **Cards (Containers):** Arredondamento alto (`rounded-[2rem]`), preenchimento generoso (`p-6` ou `p-8`). Não usar bordas duras de cores sólidas.
*   **Sombras:** Sombras coloridas fracas e suaves (`shadow-[0_0_20px_rgba(...)]`) apenas para "fazer pular" os botões de ação principal (Simular Semana).
*   **Ícones:** Biblioteca Lucide React (`lucide-react`). Tamanho reduzido (12px, 14px) combinados com o texto de cabeçalho das seções.
*   **Scrollbars:** Escondidas (`hide-scrollbar`) no CSS global para manter o visual limpo nas listas verticais (tabelas, histórico).
*   **Animações:** `motion.div` do Framer Motion usado apenas para entradas de tela (Fade in, deslize suave em X ou Y). Evitar animações de "pulo" ou loop infinito na UI, exceto para elementos 3D ambientais (Three.js).

## 5. Implementação Global
O Tailwind será consumido sem arquivos CSS paralelos. As poucas utilidades que precisarem (ex: `hide-scrollbar`) serão adicionadas via classes injetadas de forma inline ou configuradas no index.css puro.

---
**Status Atual:** Concluído.
**Próximo Passo Planejado:** Início das Implementações. O usuário definirá qual será a PRIMEIRA funcionalidade a ser implementada na fase de engenharia, garantindo a regra de 1 de cada vez.
