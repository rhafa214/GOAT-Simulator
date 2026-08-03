# Guia de Rigging e Animação do Avatar 2.0 (Mixamo + Blender)

Este guia prático ensina como transformar um modelo 3D estático (GLB) em um personagem riggado e animado (com "esqueleto" e animação base "Idle"), utilizando ferramentas gratuitas: Blender e Mixamo (da Adobe).

## Pré-requisitos
- O arquivo do modelo estático: `goat_base_human_v1.glb`
- [Blender](https://www.blender.org/download/) instalado (versão 3.6 ou superior recomendada).
- Conta gratuita na Adobe para acessar o [Mixamo](https://www.mixamo.com/).

## Passo 1: Preparar o Modelo (Blender)
O Mixamo geralmente trabalha melhor com arquivos `.fbx` ou `.obj` em vez de `.glb`. Vamos usar o Blender para converter e garantir que o modelo esteja pronto.

1. Abra o **Blender**.
2. Exclua todos os objetos padrões da cena inicial (Câmera, Cubo, Luz): aperte `A` para selecionar tudo, depois `X` e clique em `Delete`.
3. Importe o seu modelo: Vá em **File > Import > glTF 2.0 (.glb/.gltf)** e selecione o `goat_base_human_v1.glb`.
4. Verifique a orientação: O personagem deve estar de frente (olhando para a direção de -Y no Blender, ou seja, de frente para você se pressionar `1` no teclado numérico).
5. Exporte como FBX: Vá em **File > Export > FBX (.fbx)**.
   - Nas configurações de exportação do lado direito, em **Path Mode**, escolha **Copy** e clique no ícone de "caixa" (Embed Textures) ao lado dele. Isso garante que as texturas vão junto.
   - Salve como `goat_base_human_v1.fbx`.

## Passo 2: O Auto-Rigging (Mixamo)
1. Acesse [mixamo.com](https://www.mixamo.com/) e faça login.
2. Clique no botão **Upload Character** (no lado direito da tela).
3. Arraste e solte o seu arquivo `goat_base_human_v1.fbx` na janela, ou clique para selecioná-lo.
4. Aguarde o upload. Se o modelo não tiver texturas inicialmente, não se preocupe, elas estarão no GLB final se seguiram pelo FBX corretamente.
5. **Posicionamento dos Marcadores:** Quando a janela do Auto-Rigger abrir, arraste os círculos coloridos para as áreas correspondentes do personagem:
   - **Chin (Queixo):** Na ponta inferior do queixo.
   - **Wrists (Pulsos):** Exatamente onde a mão se conecta ao braço.
   - **Elbows (Cotovelos):** No meio do braço onde dobra.
   - **Knees (Joelhos):** No meio da perna onde dobra.
   - **Groin (Virilha):** No centro inferior do tronco (área da pélvis).
6. Deixe a opção de simetria (Use Symmetry) marcada, a menos que o modelo seja muito assimétrico.
7. Em **Skeleton LOD**, mantenha "Standard (65)".
8. Clique em **Next** e aguarde o algoritmo processar.
9. Se deu tudo certo, seu personagem aparecerá se movendo. Clique em **Next** para confirmar o personagem.

## Passo 3: Escolher a Animação Idle (Mixamo)
1. No painel esquerdo do Mixamo, clique na aba **Animations**.
2. Na barra de busca, digite **Idle**.
3. Escolha uma animação base que seja estável e não muito exagerada (ex: "Standing Idle" ou "Happy Idle"). Clique nela para ver seu personagem realizar o movimento.
4. (Opcional) Ajuste parâmetros como _Arm Space_ para evitar que os braços atravessem o corpo.
5. Quando estiver satisfeito, clique no botão **Download** no lado direito da tela.
6. Configure as opções de Download:
   - **Format:** FBX Binary (.fbx)
   - **Skin:** With Skin
   - **Frames per Second:** 30
   - **Keyframe Reduction:** None
7. Clique em **Download**. Salve o arquivo no seu computador (ele provavelmente virá com o nome da animação, ex: `Standing_Idle.fbx`).

## Passo 4: Converter de Volta para GLB (Blender)
O GOAT Simulator usa arquivos `.glb`. Vamos converter o resultado do Mixamo.

1. Abra o **Blender** (um arquivo novo/vazio).
2. Limpe a cena padrão novamente (selecione tudo com `A`, delete com `X`).
3. Importe o arquivo baixado do Mixamo: **File > Import > FBX (.fbx)**. Selecione o arquivo baixado (ex: `Standing_Idle.fbx`).
4. Renomeie a animação (Opcional, mas recomendado):
   - Abra a janela "Dope Sheet" no Blender e mude o modo para "Action Editor".
   - Mude o nome da ação ativa de algo como `mixamo.com` para `idle`. Isso ajuda a aplicação a reconhecê-la mais fácil.
5. Exporte para GLB: Vá em **File > Export > glTF 2.0 (.glb/.gltf)**.
   - Em **Format**, deixe **glTF Binary (.glb)**.
   - Certifique-se de que, na aba **Animation**, a caixa **Animation** está marcada.
   - Salve o arquivo como **`goat_base_human_v1_rigged.glb`**.

## Passo 5: Atualizando no Projeto
Com o arquivo final gerado, basta colocá-lo na pasta correta do projeto:

- Coloque o `goat_base_human_v1_rigged.glb` na pasta `/public/models/avatar/` do projeto.
- Altere a propriedade `"status"` deste modelo de `"unavailable"` para `"available"` no arquivo `/public/models/avatar/manifest.json`.

O projeto passará a usar automaticamente a versão animada e riggada!
