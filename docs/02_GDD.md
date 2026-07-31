# 02. Game Design Document (GDD)

## 1. Visão Geral
**Nome Provisório:** GOAT Simulator (The Journey)
**Gênero:** Simulação Esportiva, RPG Textual/UI, Management
**Público-Alvo:** Fãs de futebol, jogadores de Football Manager e modos "Rumo ao Estrelato/Carreira" do FIFA/PES.
**Plataforma:** Web (Desktop e Mobile)

## 2. Core Gameplay Loop
1. **Verificar Status:** O jogador acessa o Hub para ver sua moral, condicionamento, atributos e status do time.
2. **Treinar/Interagir:** Escolhe o foco de treinamento da semana ou interage com elenco/mídia para ganhar moral ou fama.
3. **Avançar Semana (Simulação):** Se houver jogo, o motor gera um resultado baseado nos atributos do jogador, nível do time vs oponente e sorte.
4. **Resultados e Evolução:** O jogador vê os resultados, lê as notícias (IA) e ganha XP/dinheiro. Com o tempo, é convocado, ganha prêmios e transfere de clube.

## 3. Entidades Principais
*   **O Jogador (Avatar):** 
    *   **Atributos RPG:** Finalização, Passe, Drible, Físico, Visão, Defesa. (0-100)
    *   **Status de Carreira:** Clube atual, Salário, Valor de Mercado, Fama.
    *   **Condição Fisiológica:** Moral (0-100), Condicionamento (0-100).
*   **O Clube:** Nome, Nível de Prestigio, Orçamento, Liga.
*   **A Liga:** Tabela de classificação, Times concorrentes.

## 4. Mecânicas de Jogo (Sistemas)
*   **Sistema de Partida:** Cálculo de chances matemáticas baseadas no Overall do jogador vs Nível da liga. O resultado gera Notas (Rating de 0.0 a 10.0), Gols e Assistências.
*   **Sistema de Fadiga:** Cada jogo diminui o Condicionamento. Condicionamento baixo aumenta drasticamente risco de lesões. Treinamento também consome condicionamento.
*   **Sistema de Notícias (IA):** Integração com OpenAI/Gemini. Eventos notáveis (hat-tricks, transferências polêmicas, premiações) disparam prompts dinâmicos que geram artigos na aba de notícias.
*   **Sistema de Dinheiro & Loja (Futuro):** Salário recebido permite comprar "Luxos" (carros, mansões, chuteiras) que dão buffs permanentes em Fama ou Moral.

## 5. Progressão & End-Game
*   **Início:** Base de um time modesto.
*   **Meio:** Titularidade, transferência para grandes ligas (Premier League, La Liga).
*   **Ápice:** Disputar Champions League, Bola de Ouro (Ballon d'Or), Copa do Mundo.
*   **Aposentadoria:** Por volta dos 35-40 anos. Geração do mural de troféus final e "Hall of Fame".

---
**Status Atual:** Concluído.
**Próximo Passo Planejado:** Apresentar a Arquitetura do Sistema.
