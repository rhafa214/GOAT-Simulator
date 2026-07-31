# 17. Inicialização do Jogo (Ambiente de Teste: Brasil)

## 1. Objetivo do Teste
Para validarmos o **Football Database Engine** e o **Sistema de Temporadas** na prática, o cenário de teste inicial forçará o avatar do jogador a iniciar sua carreira no futebol brasileiro.

## 2. Fluxo de "Novo Jogo" (Game Start)
Quando o usuário clicar em "Novo Jogo", o sistema fará o seguinte setup silencioso:

### 2.1. Hidratação do Banco de Dados
O script de importação (Asset Import System) vai ler os JSONs da pasta `/assets` gerados anteriormente e preencher o banco de dados em memória/SQLite WASM com:
*   1 País (Brasil)
*   3 Competições
*   4 Clubes (Flamengo, Palmeiras, São Paulo, Atlético Mineiro)
*   Técnicos, Estádios e Jogadores base.

### 2.2. Criação do Avatar
O usuário preencherá uma tela simples:
*   **Nome:** (ex: João Silva)
*   **Posição:** (ex: ST)
*   **Clube Inicial:** O usuário escolherá entre os 4 clubes brasileiros disponíveis.

O sistema então fará os inserts no banco:
1.  **Entidade Player:** Cria o registro `id: 'pla_avatar'` (ou UUID).
    *   `nation_id: 'nation_brazil'`
    *   `club_id`: (O clube escolhido, ex: `'club_flamengo'`)
    *   `current_ability`: 70 (Jovem promessa)
    *   `potential_ability`: 90
2.  **Entidade Contract:** Cria o primeiro contrato do jogador.
    *   `wage`: 5000 (Salário inicial base).
    *   `start_date`: Início da temporada.
    *   `end_date`: +2 anos.

### 2.3. Setup da Temporada 1
1.  O motor cria a `Season` com `year: 2024` e `status: ACTIVE`.
2.  Gera a **Tabela de Classificação (Standings)** inicial para a `comp_bra_serie_a` contendo os 4 clubes zerados (0 Pts).
3.  Gera o **Calendário (Fixtures)** do primeiro mês, cruzando os 4 clubes disponíveis.

## 3. Estado Inicial da UI (Dashboard)
Ao terminar o carregamento, a tela principal (Hub Central) será renderizada.
*   O fundo e as cores principais da UI se adaptarão automaticamente para as cores do clube escolhido (ex: Vermelho e Preto se for Flamengo, Verde e Branco se for Palmeiras).
*   A aba "Clube" mostrará os companheiros reais importados do JSON (ex: Gabigol, Raphael Veiga).
*   A caixa de entrada (Inbox) terá 1 mensagem de boas-vindas do Técnico (ex: Tite dando as boas-vindas ao profissional).

## 4. O que testaremos?
Com esse setup focado e reduzido, poderemos testar:
1.  A velocidade de leitura dos dados do banco para a UI.
2.  A simulação da primeira partida (Fixtures).
3.  O avanço do calendário diário.
4.  O ganho ou perda de energia (Fitness) após a partida teste.
