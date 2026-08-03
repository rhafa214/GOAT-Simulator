# Avatar Asset Pipeline

Este documento detalha o processo para adicionar e manter os modelos 3D do Avatar 2.0.

## Requisitos do Modelo Humano
Para garantir performance e consistência:
- **Tamanho:** O arquivo `.glb` ou `.gltf` deve ter preferencialmente menos de 5 MB.
- **Texturas:** Devem ser atlas de no máximo 1024x1024. Nunca 4K.
- **Otimização:** Modelos devem estar prontos para futuras otimizações via Draco e Meshopt, embora não os exijamos até possuirmos um modelo oficial.
- **Licença:** Todo asset **DEVE** ter licença comercial permissiva ou adquirida. A origem e autoria devem estar documentadas no `manifest.json`. **Sem exceções.**

## Rig e Bones
O modelo deve possuir um rig estilo *Humanoid*. Os nomes dos ossos (bones) devem seguir um padrão compatível ou ser facilmente mapeáveis. Ossos essenciais:
- Hips
- Spine, Spine1, Spine2
- Neck, Head
- LeftShoulder, LeftArm, LeftForeArm, LeftHand
- RightShoulder, RightArm, RightForeArm, RightHand
- LeftUpLeg, LeftLeg, LeftFoot, LeftToeBase
- RightUpLeg, RightLeg, RightFoot, RightToeBase

## Animações
O arquivo GLB principal, ou arquivos complementares de animação, devem incluir clipes nomeados seguindo o enum `AvatarAnimationState`:
- `idle` (Obrigatório)
- `confident`
- `celebration`
- `holdingShirt`
- `holdingTrophy`
- `wave`

Caso a animação requisitada pelo jogo não esteja disponível no modelo, o `AvatarAnimationController` fará fallback automático para `idle`.

## Como Adicionar um Modelo
1. **Adquira** um modelo GLTF/GLB válido e licenciado.
2. Coloque o arquivo no diretório `/public/models/avatar/`.
3. Adicione uma entrada ao `manifest.json` incluindo informações precisas (tamanho, meshes disponíveis, status).
4. O `status` deve ser `"available"` para o modelo ser testado ou exibido.

## Como Substituir o Modelo Atual
O sistema está projetado em seletor (`AvatarRenderer`). A interface do jogo *não precisa ser alterada*.
Basta atualizar a entrada `"available"` no `manifest.json`. O `AvatarRenderer` baixará o manifesto, validará o asset e, em caso de sucesso, renderizará via `AvatarGLTFModel`. Caso contrário, cairá em fallback sem interromper o jogo.

## Limitações Atuais (Etapa 1)
- O `AvatarGLTFModel` ainda não aplica texturas modulares com base na interface de customização (cabelo, botas, tons de pele customizados).
- Como ainda não há um modelo oficial licenciado, o sistema renderiza automaticamente o `LegacyAvatarModel` ou um *placeholder* indisponível listado no manifest.
- O sistema ainda não está injetado na `AvatarScene` oficial (apenas a arquitetura paralela e preparada).
