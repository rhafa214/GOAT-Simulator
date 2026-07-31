# 18. Arquitetura de Importação de Dados Reais (Strict Mode)

## 1. Princípio Fundamental
**Tolerância Zero para Dados Fictícios.** O sistema foi re-arquitetado para operar sob um modelo estrito de veracidade. Se um dado (como a capacidade de um estádio ou a sigla de um clube) não for encontrado na fonte oficial de importação, ele será deixado em branco (nulo) e um log de aviso (Warning) será gerado, mas **NUNCA** inventado ou preenchido com dados aproximados.

## 2. Visão Geral da Arquitetura (ETL Pipeline)
Para suportar dados reais e atualizações contínuas sem alterar o código principal, implementaremos um pipeline de **ETL (Extract, Transform, Load)** isolado do motor de jogo.

A arquitetura se divide em 3 camadas:

### 2.1. Camada de Extração (Extract) - `Data Fetchers`
Responsável por buscar os dados brutos de fontes reais.
*   **Fontes Aceitas:** APIs externas confiáveis (ex: API-Football, football-data.org) ou arquivos de dump CSV/JSON estáticos extraídos de bancos de dados oficiais.
*   **Isolamento:** Esta camada apenas faz o download e salva os "Raw Data" (dados brutos) temporariamente.

### 2.2. Camada de Transformação e Validação (Transform) - `Data Validator & Mapper`
O coração do sistema rigoroso. Converte os dados brutos de terceiros para o formato do nosso banco de dados.
*   **Mapeamento:** Transforma campos como `team.name` para o nosso `official_name`.
*   **Validação Rigorosa:** Antes de passar um clube adiante, passa por regras estritas. Exemplo: Se o `nome_oficial` não existir, o registro é descartado. Se a `capacidade` do estádio não existir, o campo recebe `null`.
*   **Logs (Audit):** Gera relatórios em `logs/import_warnings.json` contendo tudo que foi ignorado ou deixado em branco.

### 2.3. Camada de Carga (Load) - `Database Seeder`
Pega os dados perfeitamente limpos e validados pela camada anterior e os insere no **Football Database Engine**.
*   **Upsert Seguro:** Utiliza IDs oficiais das fontes (ex: `external_api_id: 135` para Flamengo) como chave de cruzamento. Se o sistema rodar a importação de novo, ele apenas atualiza os dados, nunca duplica.

## 3. Estrutura de Diretórios do Importador
```text
/src/importer/
  ├── sources/        # Scripts para ler APIs ou CSVs brutos
  ├── validators/     # Regras de negócio (ex: rejectFakeClubs.ts)
  ├── mappers/        # Converte de Source para o schema do DB
  ├── loaders/        # Insere no SQLite / JSON final
  └── run.ts          # O script orquestrador do pipeline
/data/
  ├── raw/            # Dados intocados da fonte (temporário)
  ├── clean/          # Dados validados prontos para o jogo
  └── logs/           # Relatórios de erro e dados ausentes
```

## 4. O Modelo de Dados Adaptado (Strict Schema)
Para acomodar dados do mundo real com precisão:

### Clube (Club)
*   `id` (String / UUID interno)
*   `external_id` (String) - ID da API fonte (para atualizações futuras).
*   `official_name` (String) - Obrigatório (Ex: "Clube de Regatas do Flamengo").
*   `short_name` (String) - Obrigatório (Ex: "Flamengo").
*   `abbreviation` (String) - Opcional, 3 letras (Ex: "FLA").
*   `foundation_year` (Int) - Opcional.
*   `colors` (JSON) - Opcional, lista de hexadecimais.
*   `logo_url` (String) - Opcional.
*   `city`, `state`, `country` (Strings) - Obrigatório para vinculação geográfica.
*   `stadium_name`, `stadium_capacity` - Opcional (se não vier da fonte oficial, fica Nulo).

## 5. Fluxo de Atualização Contínua
Como a arquitetura é baseada no `external_id`, o código do motor de jogo permanece intacto. Quando uma nova temporada começar na vida real (ex: times promovidos para a Série A 2025):
1. O desenvolvedor roda o script: `npm run import:update-season 2025`.
2. A Camada de Extração baixa os novos clubes da Série A.
3. A Camada de Validação confere os dados.
4. A Camada de Carga atualiza a tabela `competitions_clubs` vinculando os clubes corretos à nova temporada, ignorando totalmente quem caiu.

## 6. Próximo Passo
Com a arquitetura definida e as regras estritas estabelecidas (Zero dados fictícios, Validação mandatória, Logs de erros), o próximo passo é implementar o **Core do Importador** (Scripts TypeScript que farão essa validação e leitura).
