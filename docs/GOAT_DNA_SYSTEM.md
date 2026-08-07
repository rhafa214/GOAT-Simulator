# GOAT DNA System

## Overview
O sistema de GOAT DNA do The Last Dance FC permite que os jogadores moldem os atributos técnicos e mentais do seu personagem escolhendo qualidades de ídolos do futebol. A mecânica de Draft apresenta cartas lendárias, concedendo bônus específicos baseados nas estatísticas reais de cada lenda.

## Current vs Potential Attributes
- **Current Attributes:** O nível técnico atual do jogador no início da carreira. Representa as habilidades imediatas.
- **Potential Attributes:** O teto de desenvolvimento do jogador. Os atributos não podem ultrapassar o potencial.
- **Regra de Cálculo:** O potencial nunca pode ser menor que o atributo atual. Bônus em potencial sempre aumentam o teto.

## Raridades
Cada carta apresentada no Draft possui uma raridade aleatória que determina o multiplicador dos bônus concedidos:
- **COMMON:** x0.7 Current | x0.7 Potential
- **RARE:** x0.9 Current | x1.0 Potential
- **EPIC:** x1.1 Current | x1.3 Potential
- **LEGEND:** x1.3 Current | x1.6 Potential
- **GOAT:** x1.5 Current | x2.0 Potential

## Bônus Atuais e Futuros
Quando um ídolo é selecionado:
- **Atributo Primário:** Recebe um grande impulso com base na proficiência do ídolo e na raridade.
- **Atributo Secundário:** O segundo melhor atributo daquele ídolo também concede um bônus menor.
- **Special Moves / Weak Foot (SM / WF):** Têm lógicas separadas sem multiplicadores quebrados.

## Regra de Deck
Para manter a diversidade e evitar drafts monótonos, implementamos regras rígidas sobre as opções geradas em cada rodada:
- **Nenhuma duplicata na rodada:** As 5 opções exibidas em uma única rodada são sempre ídolos únicos.
- **Idolos Escolhidos NUNCA reaparecem:** Se o jogador escolher a carta de um ídolo, aquele ídolo é removido permanentemente do pool e nunca mais reaparecerá no Draft atual.
- **Evitar reexibição:** Cartas que apareceram mas NÃO foram escolhidas são adicionadas a uma "Pilha de Descartes" (`seenIdolIds`). O motor sempre tenta exibir apenas cartas **inéditas**.

## Regra de Reciclagem
- **Limitação de Catálogo vs Rodadas:** Um Draft Completo possui 17 rodadas e exibe 5 opções por rodada (necessitando de 85 exibições). Como o catálogo atual possui apenas 25 lendas, as opções inéditas vão se esgotar.
- **Comportamento da Reciclagem:** Quando restam menos de 5 cartas inéditas no catálogo, o motor recorre às cartas da Pilha de Descartes (`seenIdolIds`), excluindo sempre as cartas já selecionadas (`selectedIdolIds`).
- **Ordem da Reciclagem:** As cartas recicladas são priorizadas pela sua ordem de "primeira exibição". Assim, as cartas que foram ignoradas na rodada 1 serão as primeiras a voltar quando as opções inéditas acabarem.

## Compatibilidade de Saves
A separação de estado entre `seenIdolIds` e `selectedIdolIds` pode causar um comportamento levemente inconsistente em saves muito antigos do modo Draft (embora pouco provável já que o Draft não é tipicamente pausado). Saves futuros armazenam estas propriedades corretamente no payload.

## Evolução Futura Planejada
- **Expansão do Catálogo:** Adicionar mais ídolos ao `IDOLS` no `mockData.ts` para reduzir a necessidade de reciclagem e aumentar a variedade (objetivo: >85 lendas para suportar o modo Completo sem reciclagem).
- **Cartas Temáticas (Eras):** Restringir o draft com base em épocas do futebol (e.g. Apenas anos 90, Apenas anos 2000).
- **Sinergias Ocultas:** Conseguir cartas de companheiros reais de clube concedendo pequenos multiplicadores passivos.
