# 08. Estrutura e Relacionamentos do Football Database Engine

## 1. Visão Geral
Este documento descreve o esquema conceitual do motor de banco de dados do simulador de carreira. O foco é mapear todas as entidades necessárias para um ecossistema vivo de futebol e como elas interagem de forma eficiente em um modelo normalizado em memória.

## 2. Domínios e Entidades

### 2.1. Geografia e Infraestrutura
*   **Continente (Continent):** Agrupa países e define competições continentais (ex: UEFA, CONMEBOL).
*   **País (Nation):** Pertence a um continente. Possui reputação, gera *newgens* (jovens promessas) com nacionalidades específicas e hospeda ligas nacionais.
*   **Cidade (City):** Pertence a um país. Adiciona fator climático e atratividade para jogadores.
*   **Estádio (Stadium):** Fica em uma cidade. Possui capacidade, qualidade do gramado e nível de infraestrutura, afetando a receita de bilheteria e lesões.

### 2.2. Instituições e Organizações
*   **Clube (Club):** Sediado em uma cidade, joga em um estádio. Possui finanças (orçamentos), reputação, cores, moral da diretoria, categorias de base e centros de treinamento.
*   **Seleção Nacional (National Team):** Representa um país. Convoca jogadores baseando-se em suas atuações nos clubes.
*   **Competição (Competition):** Pode ser Liga, Copa Nacional ou Copa Continental. Possui regras (rebaixamento, prêmios) e reputação.
*   **Patrocinador (Sponsor):** Entidade abstrata que injeta dinheiro nos clubes/competições via contratos de tempo determinado.

### 2.3. Atores do Jogo
*   **Jogador (Player):** A entidade mais rica. Possui atributos físicos, técnicos e mentais, posição, idade, nacionalidade, condição física (fitness), nível de energia e moral.
*   **Treinador/Manager (Manager):** Gerencia um clube ou seleção. Tem atributos táticos, estilo de jogo preferido e nível de disciplina.
*   **Árbitro (Referee):** Pertence a um país. Possui rigidez (tendência a dar cartões e faltas).
*   **Empresário (Agent):** Representa um grupo de jogadores. Possui nível de ganância, paciência e habilidade de negociação.

### 2.4. Estrutura Esportiva e Tempo
*   **Temporada (Season):** O escopo anual (ex: 2024/2025). Associa clubes às competições.
*   **Rodada (Matchday/Round):** Uma etapa cronológica dentro de uma temporada/competição.
*   **Calendário (Calendar):** O relógio global. Mapeia dias do ano para eventos, partidas, janelas de transferência e premiações.
*   **Tabela (Standings):** Classificação viva de uma competição (pontos, vitórias, saldo de gols).
*   **Ranking:** Coeficientes globais para clubes e países, afetando vagas continentais e reputação.

### 2.5. Eventos e Transações (Vida Útil)
*   **Contrato (Contract):** O elo entre Jogador/Treinador e Clube. Contém salário, tempo de duração, bônus e multas rescisórias.
*   **Partida (Fixture/Match):** O confronto entre dois clubes. Gera eventos estáticos (resultado) e estatísticas.
*   **Transferência (Transfer):** Histórico de movimentação. Envolve Clube de Origem, Clube de Destino, Jogador, Valor pago e Data.
*   **Lesão (Injury):** Ocorre com jogadores. Possui tipo, gravidade e tempo estimado de recuperação.
*   **Notícia (News):** Geração de lore textual entregue na caixa de entrada do jogador sobre eventos do mundo.
*   **Premiação (Award):** Bola de Ouro, Artilheiro, Luva de Ouro, Seleção do Ano.
*   **Histórico (History/Record):** Estatísticas consolidadas (arquivo morto) de temporadas passadas para manter o banco leve sem precisar armazenar todas as partidas antigas.

## 3. A Teia de Relacionamentos (Como tudo se conecta)

1.  **O Ecossistema do Jogador:** 
    Um **Jogador** nasce associado a um **País** (nacionalidade). Ele é representado por um **Empresário** que negocia um **Contrato** para ele. Este Contrato o vincula a um **Clube**. 
    
2.  **O Ambiente do Clube:** 
    O **Clube** é gerenciado por um **Treinador**, patrocinado por **Patrocinadores**, manda seus jogos em um **Estádio** localizado em uma **Cidade**, dentro de um **País**. 
    O Clube disputa **Competições** de acordo com seu **Ranking**.

3.  **A Máquina do Tempo (Simulação de Partidas):** 
    O **Calendário** avança os dias. Quando chega um dia de jogo, a **Rodada** aciona a **Partida**.
    Na Partida, o **Clube A** enfrenta o **Clube B**, num **Estádio**, sob o apito de um **Árbitro**. 
    O simulador cruza a tática do **Treinador** com os atributos dos **Jogadores** e calcula o resultado. 
    A Partida pode gerar uma **Lesão** em um Jogador (afetando sua condição física) e sempre gera **Histórico/Estatísticas** (gols, assistências, passes).

4.  **Fechamento do Ciclo:** 
    O resultado da Partida altera a **Tabela**. Ao final da **Temporada**, a Tabela define campeões e rebaixados.
    Baseado nas Estatísticas geradas nas Partidas, o sistema distribui **Premiações**. 
    Os melhores Jogadores da Temporada ganham reputação e podem ser convocados para a **Seleção Nacional** de seus Países, ou cobiçados por clubes maiores através de uma **Transferência**, intermediada novamente pelo **Empresário**, criando um novo **Contrato**. Tudo isso é relatado ao usuário através de **Notícias**.

## 4. Estratégia de Gerenciamento de Memória (Trade-off Otimizado)
Para manter o jogo escalável:
*   **Dados Frios (Arquivamento):** Partidas antigas são descartadas do array ativo de *Fixtures*. Apenas os totais resumidos são armazenados no **Histórico** do jogador e do clube ao fim da temporada.
*   **Dados Quentes:** A condição física (*fitness*), moral e atributos dos jogadores operam como ponteiros na memória de alta velocidade, alterados diariamente pela rotina de treino calculada em background.
