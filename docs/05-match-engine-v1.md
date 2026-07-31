# Match Simulation Engine v1

## Visão Geral
O novo `MatchSimulationEngine` (`src/core/domain/matchEngine.ts`) foi implementado como uma função pura que recebe os parâmetros da partida e um gerador de números aleatórios (`RandomSource`), garantindo testes determinísticos e ausência de efeitos colaterais.

## Fatores e Pesos
O motor considera diversos fatores para determinar o resultado e a atuação do jogador:

1. **Placar (Força das Equipes)**
   - A força base da equipe do jogador é ajustada ligeiramente pelo `overall`, `fitness` e `moral` do jogador.
   - O mando de campo concede um bônus multiplicativo de `1.2x` na probabilidade de gols.
   - Gols são gerados usando a Distribuição de Poisson, calculando as médias de gols (`lambda`) com base na razão de força entre as duas equipes, ajustadas pelo mando de campo.

2. **Atuação do Jogador (Gols e Assistências)**
   - **Gols:** Probabilidade baseada na posição (ST = 35% de chance de marcar a cada gol do time, CAM = 15%, CB = 3%).
   - **Assistências:** Probabilidade baseada na posição (CAM = 25%, LW/RW = 20%, CB = 1%).
   - Ambas as probabilidades são ponderadas proporcionalmente aos minutos jogados (ex: jogar 45 minutos corta as chances pela metade).

3. **Cartões**
   - Probabilidade base influenciada pela posição (Volantes e Zagueiros ~15-20%, Atacantes ~5%).
   - Clássicos (`DERBY`) e Finais aumentam a chance de cartões em `1.5x`.

4. **Lesões**
   - Chance base: `1.5%` por partida.
   - Aumenta caso o `fitness` do jogador esteja abaixo de 70 (ex: fitness de 50 adiciona +2% de chance).

5. **Impacto Físico (Fitness)**
   - Um jogo completo de 90 minutos drena entre `15` e `20` de fitness.
   - Jogos de alta intensidade (Clássicos e Finais) drenam um bônus adicional de `5` pontos.
   - Escalonado proporcionalmente aos minutos em campo.

6. **Nota (Rating) e Homem do Jogo**
   - Nota base `6.0`, ajustada pelo Overrall do jogador comparado à força do adversário.
   - Resultado do time (+0.5 por vitória, -0.5 por derrota).
   - Bônus por gol (+1.0) e assistência (+0.5).
   - Zagueiros e goleiros recebem +0.5 por não sofrer gols (*Clean Sheet*).
   - Penalidade por cartões (-0.5 Amarelo, -1.5 Vermelho).
   - Ruído aleatório entre -0.3 e +0.3 para variar notas de atuações semelhantes.
   - **MOTM (Homem do jogo):** Exige no mínimo `7.5` com gols, ou `8.5` em caso de vitória.

## Limitações (Para futuras versões)
- Sem cálculo individual de cada jogador da equipe (usa nível médio do time/adversário).
- Não calcula substituições táticas ao longo da simulação, o jogador entra com minutos pré-definidos.
- Os eventos de jogo são simplificados (distribuídos aleatoriamente baseados na estatística gerada).
