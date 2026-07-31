# 13. Asset Import System (Sistema de Importação)

## 1. Visão Geral
O sistema exige uma rotina automática que, ao inicializar o projeto, varra a pasta de `/assets` (contendo dados e imagens), processe o conteúdo, crie/atualize registros no banco de dados, relacione as imagens com os registros, previna duplicações e gere logs da operação.

## 2. Estrutura de Pastas Esperada
```text
/assets
  /clubs          (ex: JSONs com dados do clube)
  /competitions   (ex: JSONs com dados da competição)
  /countries      (ex: JSONs com dados dos países)
  /players        (ex: JSONs com atributos dos jogadores)
  /stadiums       (ex: JSONs com dados dos estádios)
  /kits           (Imagens .png de uniformes)
  /logos          (Imagens .png de escudos de clubes/competições)
  /flags          (Imagens .png de bandeiras)
  /faces          (Imagens .png de rostos de jogadores)
```

## 3. Desafio Técnico e Trade-offs (Decisão de Arquitetura)

Como decidimos anteriormente que o **Motor de Jogo roda no Cliente (Navegador)** usando um modelo de dados em memória ou SQLite WASM para performance, temos um dilema sobre *onde* esse script de importação vai rodar e *como* o cliente acessa esses dados.

Abaixo as opções e trade-offs:

### Opção A: Importador no Back-end (Express/Node.js) gerando um Banco Mestre
*   **Como funciona:** Quando o comando `npm run dev` ou `npm start` é rodado, o `server.ts` executa uma rotina em Node.js (usando `fs`). Ele lê os JSONs e Imagens, gera IDs consistentes (fazendo hash do nome para evitar duplicados, ex: `md5('Real Madrid')`), e salva tudo em um banco de dados SQLite Mestre no servidor (ou arquivo JSON Master).
*   **Vantagens:** O Node.js tem acesso total e ultrarrápido ao disco. Pode verificar hashes de imagens para evitar duplicações de arquivos. Pode gerar logs detalhados em arquivos `.log`.
*   **Desvantagens:** O Front-end precisará fazer o download desse banco de dados preenchido na primeira vez que o usuário acessar o site para poder rodar as simulações off-line/localmente.

### Opção B: Build-Time Script (Vite Plugin / Script de Pré-build)
*   **Como funciona:** Criamos um script que roda *antes* do Vite compilar o React. Ele transforma a pasta `/assets` em um arquivo gigante chamado `initial_seed.json` (ou um `.sqlite` pronto) e joga dentro da pasta `/public/` do React.
*   **Vantagens:** O front-end fica 100% estático. Não depende do servidor backend em tempo de execução para os assets. 
*   **Desvantagens:** É necessário reiniciar o servidor/build toda vez que você jogar uma foto nova na pasta `/assets`.

### Opção C: Abordagem Híbrida (Recomendada)
*   Deixamos a pasta `/assets` dentro do Back-end.
*   No momento em que o servidor Node.js (Express) inicia, ele varre as pastas, consolida os dados e garante que cada Entidade tem um UUID previsível baseado em seu nome ou código.
*   O Node gera logs coloridos no console e em um arquivo `import.log`.
*   O servidor Express expõe uma rota `/api/database/seed` para o Front-end. No primeiro *Load* do jogo, o Front-end baixa essa semente (se já não tiver no Cache/IndexedDB) e hidrata o banco de dados do navegador.
*   As imagens (logos, faces) são servidas estaticamente pelo Express (`app.use('/assets', express.static(...))`). O script cruza os nomes. Exemplo: se encontrar `Real Madrid.json` e `Real Madrid.png` na pasta `/logos`, o registro de banco ganha a coluna `logoUrl: '/assets/logos/Real Madrid.png'`.

---

## 4. Estratégia de Identificação e Deduplicação (O Motor de Importação)
Para ignorar duplicados e atualizar registros:
1.  **Geração de Chave Determinística:** O ID de um país não será um UUID aleatório que muda a cada restart, e sim um Hash ou Slug do seu nome unívoco (ex: `nation_brazil`, `club_real_madrid`). 
2.  **Upsert:** O script sempre fará a lógica de *Upsert* (Update se existir, Insert se não existir).
3.  **Ligação Dinâmica (Relacionamentos):** O clube `club_real_madrid` definirá em seu JSON: `nation: "Spain"`. O script de importação procurará o ID do país "Spain" que já foi importado, e criará a chave estrangeira corretamente (`nation_id: 'nation_spain'`).

## Aguardando Confirmação
Seguindo as regras do projeto, apresento estes Trade-offs antes de implementar. 
**A Opção C é a mais adequada para os requisitos e arquitetura atual.** Você concorda em prosseguir com a **Opção C**? Assim que confirmado, criarei os scripts de parsing, relacionamentos e o sistema de log.
