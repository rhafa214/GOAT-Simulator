# Fluxo de Upload do Modelo GOAT Player v4

Este documento descreve as etapas para o upload e disponibilização do arquivo `goat_player.glb`.

## 1. Antes do upload (Fase Atual)

Enquanto o arquivo binário `.glb` ainda não foi feito upload (fase "pending"):
- **Status do Modelo:** No arquivo `public/models/avatar/manifest.json`, o modelo está configurado com `"status": "pending"`.
- **Proteção Pending:** No arquivo `protected-assets.json`, o asset está marcado como `pending: true`.
- **Fallback:** A aplicação utiliza o `LegacyAvatarModel` como fallback seguro na tela e não tenta carregar o modelo no 3D Canvas, garantindo que a tela não fique em branco e que a UI continue funcional.
- O sistema de validação (tanto no pré-build quanto no pós-build) pula com sucesso a validação pesada desse asset sem quebrar o build.

## 2. Depois do upload

Quando você realizar o upload real do arquivo para `/public/models/characters/default/goat_player.glb`, os seguintes passos **devem** ser seguidos na configuração da aplicação:

1. **Obter Metadados do Arquivo:** Meça o tamanho (`fileSizeKB`) do novo arquivo carregado e calcule o Hash (SHA-256).
2. **Atualizar Manifest (`manifest.json`):**
   - Mude `"status"` de `"pending"` para `"available"`.
   - Preencha o tamanho no campo `fileSizeKB`.
   - Adicione o array `meshes` de acordo com a topologia do modelo.
3. **Atualizar Configuração de Proteção (`protected-assets.json`):**
   - Remova a propriedade `"pending": true`.
   - Preencha `"expectedSize"`, `"expectedHash"` (com o valor SHA-256) e `"expectedMagic"` (geralmente `"glTF"`).
4. **Executar Pipeline de Qualidade:**
   - Rode `npm run lint` para checar os tipos.
   - Rode `npm run test:run` para executar toda a suíte de testes.
   - Rode `npm run build` que executará as validações `prebuild` e `postbuild` contra o arquivo binário presente, assegurando que não haja falha (corrupção) na disponibilização do asset.
