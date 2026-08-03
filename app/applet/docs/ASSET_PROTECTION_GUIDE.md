# Asset Protection Guide

## Arquivos Protegidos
Todos os arquivos binários do projeto (.glb, .gltf, .fbx, .blend, .png, .jpg, .jpeg, .webp, .mp3, .wav, .mp4, .zip) são estritamente protegidos. O agente de IA não possui permissão para editar, recriar, converter, renomear, sobrescrever ou excluir esses arquivos. 

Em especial, os modelos listados em `protected-assets.json` passam por uma validação estrita de tamanho e hash criptográfico (SHA-256) antes do build.

## Por que a IA não deve alterá-los
Modelos 3D, áudios e imagens binárias perdem sua integridade ou formato correto caso manipulados inadequadamente como texto, resultando em arquivos truncados ou corrompidos. Agentes de IA são voltados a gerar código textual, não manipular blocos binários.

## Como substituir um asset corretamente
1. Substitua o arquivo localmente, garantindo sua integridade e testando a funcionalidade.
2. Descubra o novo tamanho e novo hash SHA-256 do arquivo.
3. Atualize os campos `expectedSize` e `expectedHash` no arquivo `protected-assets.json`.
4. Faça o commit da mudança.

## Como atualizar tamanho e SHA-256
Para calcular o novo tamanho e hash, você pode utilizar os comandos:
```bash
stat -c "%s" public/models/avatar/goat_base_human_v2.glb
sha256sum public/models/avatar/goat_base_human_v2.glb
```
Ou utilizar o node.js:
```bash
node -e "const fs = require('fs'); const crypto = require('crypto'); const p = 'caminho/do/arquivo'; console.log(fs.statSync(p).size, crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'));"
```

## Como restaurar pelo backup
Se a validação falhar (`npm run validate:assets`), o arquivo pode ter sido corrompido por uma edição indesejada. Para restaurar, recupere do último commit íntegro usando o git:
```bash
git checkout HEAD -- public/models/avatar/goat_base_human_v2.glb
```
E avise imediatamente a IA para não regerar o binário.

## Como validar antes do commit
Execute localmente:
```bash
npm run validate:assets
```
A pipeline do GitHub Actions foi atualizada e impedirá deploys caso os assets protegidos tenham sido modificados incorretamente.
