# Scripts de Ferramentas

Este diretório contém scripts utilitários e de pipeline de dados que não fazem parte do build da aplicação principal, mas são utilizados para geração e atualização de dados estáticos do jogo.

## Arquivos:

- `generate_brazil_assets.cjs`: Gera os assets e entidades do banco de dados (clubes, estádios, etc) formatados para o jogo.
- `update_and_run_pipeline.ts`: Pipeline de validação que consome dados do openfootball.
- `patch_brazil_logos.ts`: Atualiza o arquivo `imported_brazil.json` para adicionar as URLs dos escudos de clubes mapeados.

- `fix-import.js`: Script utilitário para corrigir imports no projeto.
- `fix_types.js`: Script utilitário para correções de tipos TypeScript no projeto.
- `update_avatars.cjs`: Script para atualizar definições e referências de avatares.
