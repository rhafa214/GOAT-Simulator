# GOAT Player v4 Integration Guide

Este documento descreve como realizar o upload e a integração do novo avatar oficial (`goat_player.glb`) via GitHub, superando o limite de upload do AI Studio.

## 1. Onde enviar o arquivo
Faça o upload do arquivo GLB diretamente no repositório do GitHub (na branch principal ou apropriada) no seguinte caminho:
`public/models/characters/default/goat_player.glb`

O nome deve ser **exatamente** `goat_player.glb`.

## 2. Como validar no GitHub Pages
Após o upload e o build do GitHub Pages, a URL final esperada para o asset será:
`/GOAT-Simulator/models/characters/default/goat_player.glb`
*(Ou o path correspondente caso o nome do repositório seja diferente).*

O jogo buscará o modelo automaticamente através do `manifest.json`.

## 3. Como ativar a proteção e validação de Asset
Quando o arquivo for enviado para o repositório, o arquivo `protected-assets.json` avisará que encontrou o arquivo e exibirá seu tamanho e hash (SHA-256) real.
Siga estes passos para travar a proteção:

1. Execute no console/terminal: `npm run validate:assets`
2. Copie o **Current Size** e **Current SHA-256** do console.
3. Edite o arquivo `protected-assets.json`:
   - Remova `"pending": true`.
   - Adicione `"expectedSize": <TAMANHO_COPIADO>`.
   - Adicione `"expectedHash": "<HASH_COPIADO>"`.
   - Adicione `"expectedMagic": "glTF"`.

## 4. Como restaurar o avatar anterior
Se for necessário voltar atrás:
1. Abra `public/models/avatar/manifest.json`.
2. Mude o `"status"` do modelo `goat_player_v4` para `"unavailable"`.
3. Certifique-se de que o avatar base anterior tenha o `"status"` de volta para `"available"`.
4. Restaure o arquivo anterior se ele tiver sido apagado.
