# 19. Integração com Fontes Reais (OpenFootball e Football-data)

## 1. Arquitetura de Fontes (Source Fetchers)
Para garantir que o banco só possua dados verdadeiros, implementamos dois extratores específicos que fazem o download e conversão direta de bancos públicos mundialmente reconhecidos.

## 2. Fonte 1: Football-Data.co.uk (Resultados e Tabelas)
*   **O que é:** O maior acervo de histórico de partidas (Fixtures e Results), fornecendo estatísticas de jogo reais.
*   **Implementação:** Criamos o script `fetchFootballDataCoUk.ts`.
*   **Como funciona:** Ele baixa os arquivos CSV diretamente do site (ex: Temporada 23/24 da Premier League via `https://www.football-data.co.uk/mmz4281/2324/E0.csv`).
*   **Processamento:** O script converte o CSV em objetos JSON limpos, extraindo `HomeTeam`, `AwayTeam`, placares reais (`FTHG`, `FTAG`) e árbitro.
*   **Status do Teste:** O teste extraiu com sucesso **380 partidas reais** da Premier League 2023/2024 e salvou em `data/raw/football_data_uk_e0_2324.json`.

## 3. Fonte 2: OpenFootball (github.com/openfootball)
*   **O que é:** Um repositório *open-source* mantido pela comunidade com o cadastro de todos os clubes, separando nome popular, nome de registro e cidade.
*   **Implementação:** Criamos o script `fetchOpenFootball.ts`.
*   **Como funciona:** Ele baixa os arquivos de texto estruturado (`.txt`) diretamente do repositório RAW do GitHub (ex: `south-america/brazil/br.clubs.txt`).
*   **Processamento:** O script lê o padrão do arquivo texto (ex: `Corinthians SP, São Paulo | SC Corinthians Paulista`) e separa em variáveis:
    *   `short_name`: Corinthians SP
    *   `city`: São Paulo
    *   `official_name`: SC Corinthians Paulista
    *   `external_id`: of_br_corinthianssp
*   **Status do Teste:** O script acessou o repositório ao vivo da internet, extraiu **74 clubes brasileiros reais** e passou todos eles pela nossa **Pipeline de Validação Strict Mode**. Os 74 clubes passaram com sucesso e foram gerados em `data/clean/openfootball_clubs_brazil_clean.json`.

## 4. Pipeline de Validação (O que aconteceu durante a importação?)
Quando os 74 clubes do OpenFootball foram passados pelo nosso script `run.ts`:
*   **Zero Inválidos:** Nenhum clube fictício foi encontrado na base, então nada foi rejeitado.
*   **74 Warnings (Avisos):** Como a base do OpenFootball fornece Nome e Cidade, mas **não fornece Estádio, Capacidade nem Ano de Fundação**, o nosso `clubValidator.ts` cumpriu a regra estrita: deixou esses campos como `null` e disparou 74 Warnings nos logs informando que faltam dados complementares, para não inventar nada.

## 5. Próximos Passos
Temos um ETL 100% funcional que puxa da internet, valida as regras de negócio de "dados reais" e deixa pronto para o banco de dados. 
O próximo passo seria escrever o **Database Seeder (Load)**, que vai pegar esses arquivos dentro de `data/clean` e inserir no SQLite WASM do simulador, para que o React possa exibi-los na tela.
