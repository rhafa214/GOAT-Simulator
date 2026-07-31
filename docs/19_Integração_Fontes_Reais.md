# 19. Integração com Fontes Reais (OpenFootball e Football-data.co.uk)

## 1. Visão Geral das Fontes

Para alimentar nosso banco de dados com informações 100% reais, essas duas fontes se complementam perfeitamente:

1.  **OpenFootball (`github.com/openfootball`)**:
    *   **Ponto Forte**: Cadastro de clubes, nomes oficiais, nomes curtos, códigos de 3 letras, países e, em alguns repositórios, cidades.
    *   **Formato**: Arquivos de texto estruturado (`.txt`) ou JSONs mantidos pela comunidade.
    *   **Papel no nosso ETL**: Será nossa fonte principal para a entidade `Clubes` e `Países`.

2.  **Football-data.co.uk**:
    *   **Ponto Forte**: O maior acervo de histórico de partidas (Fixtures e Results), com datas, placares e estatísticas de jogo (chutes, escanteios, faltas).
    *   **Formato**: Arquivos `.csv` organizados por país, liga e temporada (ex: `E0.csv` para Premier League).
    *   **Papel no nosso ETL**: Será nossa fonte principal para a entidade `Tabelas (Standings)`, `Histórico de Partidas (Fixtures)` e para cruzar os nomes dos clubes para garantir que batem com o OpenFootball.

## 2. Como Faremos a Extração (Camada Fetcher)

Para extrair esses dados de forma automatizada, vamos criar scripts em Node.js (TypeScript) dentro da pasta `src/importer/sources/`.

### Passo A: Fetcher do OpenFootball (Clubes)
*   Faremos requisições HTTP GET para a API do GitHub (RAW) buscando os arquivos dos repositórios do OpenFootball.
*   Exemplo de URL: `https://raw.githubusercontent.com/openfootball/clubs/master/br-brazil/1-serie-a.txt`
*   **Mapper**: O script lerá cada linha, identificará o padrão do texto e converterá para o nosso objeto `RawClub`.

### Passo B: Fetcher do Football-Data (Partidas/Calendário)
*   Faremos download dos CSVs diretamente do site.
*   Exemplo de URL: `https://www.football-data.co.uk/mmz4281/2324/E0.csv` (Inglaterra, Série A, 2023/2024).
*   **Mapper**: Vamos ler o CSV, e extrair as colunas `Date` (Data), `HomeTeam` (Mandante), `AwayTeam` (Visitante), `FTHG` (Gols Mandante), `FTAG` (Gols Visitante).

### Passo C: O Cruzamento (Reconciliation)
Como as duas fontes são diferentes, o nome do clube no CSV pode ser "Man United" e no OpenFootball "Manchester United". 
Para isso, precisaremos de um **Dicionário de Sinônimos (Alias Dictionary)** no nosso validador. Se o sistema não conseguir cruzar o nome perfeitamente, ele vai gerar um Log de Aviso (Warning) para intervenção manual (seguindo a nossa regra estrita).

## 3. Implementação

Abaixo, vou gerar o código para baixar e processar os dados dessas fontes reais diretamente para a nossa pasta `data/raw`.
