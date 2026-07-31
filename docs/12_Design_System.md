# 12. Design System

## 1. Visão Geral e Filosofia
A estética do GOAT Simulator será um misto entre a interface "Clean Dark Mode" de um sistema de dados esportivos (como o Football Manager) e o glamour arcade de jogos como o FIFA/EAFC.
A prioridade é o **Contraste** e a **Legibilidade**, já que o usuário lerá muitos números e textos minúsculos.

## 2. Tipografia
*   **Fonte Principal (Títulos, Placar, Números de Stats):** `Tektur`, `Bebas Neue` ou `Orbitron` (Fontes Display/Tech que passam a sensação esportiva).
*   **Fonte de Corpo (E-mails, Nomes, Menus):** `Inter` ou `Plus Jakarta Sans` (Clara, perfeitamente legível em tabelas pequenas).
*   **Peso (Weight):** Muito uso de `Font-Black` (900) para Overalls e números grandes, contrastando com `Medium` (500) em legendas de apoio textuais.

## 3. Paleta de Cores (Dark Premium)
O aplicativo não será puramente preto, terá tons muito profundos e acentos brilhantes.

*   **Fundos (Backgrounds):**
    *   Fundo principal: Zinc-950 (`#09090b`) ou um tom de obsidiana escuro com sutil gradiente.
    *   Painéis/Cartões: Zinc-900 (`#18181b`) com border sutil (Zinc-800) ou efeitos de *glassmorphism* (fundo translúcido com `backdrop-blur`).
*   **Texto:**
    *   Principal: Branco (`#ffffff`) ou Zinc-100 para títulos fortes.
    *   Secundário/Mutado: Zinc-400 (`#a1a1aa`) para labels e cabeçalhos de tabela.
*   **Cores de Acento (Status & Rarity):**
    *   Acento Primário (GOAT): `Yellow-500` (`#eab308`) brilhante, usado para Overalls altos e botões principais.
    *   Sucesso / Forma Alta: `Emerald-500` (`#10b981`).
    *   Alerta / Forma Baixa / Lesão: `Red-500` (`#ef4444`).
    *   Informação / Menu Ativo: `Blue-500` (`#3b82f6`).

## 4. Layout e Espaçamentos
Baseado no TailwindCSS, priorizaremos o alinhamento rigoroso (Grids e Flexbox) para garantir que as tabelas de atributos e classificação de ligas fiquem perfeitamente alinhadas, independente do tamanho da tela.
*   Bordas Arredondadas (Radius): `rounded-xl` ou `rounded-2xl` para painéis para dar um aspecto mais acolhedor, não excessivamente rígido. `rounded-full` em botões de ação primária (Pills).
*   Espaçamento Rítmico: Uso pesado de `gap-4` a `gap-8` para separação nítida de seções.

## 5. Efeitos e Animações (Motion)
O jogo deve parecer "vivo".
*   Ao mudar de aba no Hub, a nova aba entra deslizando (`framer-motion` inicial y: 10, opacity: 0 -> y: 0, opacity: 1).
*   Sempre que um atributo do jogador aumentar, o número fará um *Pulse* (Pulsar) na cor verde (`Emerald-500`).
*   Botões importantes (como Avançar) terão `hover:scale-105` e uma sombra colorida brilhante (glow) em volta.

---
**Status da Fase de Arquitetura:** Concluída integralmente.
Todas as fundações do Banco de Dados e UI/UX foram projetadas.
