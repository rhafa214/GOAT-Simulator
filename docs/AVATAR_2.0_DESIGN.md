# Avatar 2.0 Design Document

## Filosofia
O avatar deve ser:
- Estilizado
- Elegante
- Limpo
- Esportivo
- Leve
- Expressivo

O design deve transmitir imediatamente a sensação de ser um jogador profissional, seguindo as linhas estéticas de referências como Dream League Soccer, EA FC Mobile e eFootball Mobile. 
**Regras de Ouro:** Nunca deve ser exageradamente realista (evitando o "uncanny valley" e o peso de renderização excessivo), nunca cartunesco de forma cômica, e nunca quadrado ou blocado como Roblox.

---

## Proporções
As proporções do corpo devem seguir um modelo humano simplificado e atlético, garantindo que animações de futebol fiquem naturais:
- **Altura:** Proporção idealizada (cerca de 7.5 a 8 cabeças de altura).
- **Largura dos ombros:** Ligeiramente mais largos que os quadris, formando uma silhueta atlética padrão (mesmo para biotipos diferentes).
- **Comprimento dos braços:** Os pulsos devem alinhar-se à altura da virilha quando relaxados.
- **Pernas:** Proporcionais, levemente alongadas para enfatizar a agilidade e facilitar a leitura dos movimentos (chutes, passes, dribles).
- **Mãos e Pés:** Levemente estilizados/maiores para leitura clara no jogo (mas sem parecer luvas de palhaço).
- **Pescoço:** Forte e integrado anatomicamente.
- **Cabeça:** Proporcional e polida, otimizada para capturar iluminação e expressões simples.

---

## Corpo
O sistema de corpo deve suportar variação de biotipos **sem alterar a hitbox ou o esqueleto (rig) base**:
- Muito magro (Slim)
- Magro (Lean)
- Atlético (Athletic)
- Forte (Muscular)
- Pesado (Heavy)

A variação de biotipo deve ser tratada através de *blend shapes* (morph targets) ou escalonamento de ossos (bone scaling) que afetam apenas a malha visual, garantindo que todas as animações e interações físicas no jogo permaneçam idênticas para todos.

---

## Rosto
O rosto será construído de forma **modular e estilizada**, focando em linhas limpas e leitura clara:
- **Olhos:** Formatos de pálpebras, geometria de globo ocular simplificada.
- **Sobrancelhas:** Geometria plana colada à pele ou textura com alpha, controlável por cor.
- **Nariz:** Variações de silhueta (curvo, reto, largo, fino).
- **Boca:** Simples, com loops topológicos prontos para animações de expressão (sorriso, grito).
- **Orelhas:** Minimalistas.
- **Mandíbula:** Controle do formato do rosto (redondo, quadrado, fino).

---

## Pele
Os diversos tons de pele utilizarão um **único shader otimizado**. 
- O material deve ter propriedades controláveis de brilho (suor) e cor (albedo). 
- Sem necessidade de texturas de poros complexas; o apelo visual virá da forma geométrica lisa e da reação à luz (subsurface scattering simplificado ou rampa de cor).

---

## Cabelo
Sistema modular e leve. Aproximadamente:
- **15 cabelos masculinos:** De cortes curtos, degradês, até dreads e cabelos longos amarrados. Geometria construída com polígonos sólidos em vez de sistemas de partículas ou alpha cards complexos (estilo *anime* ou *brawl stars* adaptado ao esporte).
- **5 barbas:** Opções desde ralas até cheias.
- **Sobrancelhas:** Sincronizadas com a cor do cabelo ou personalizáveis.

---

## Uniforme
Peças de equipamento independentes para máxima customização:
- **Camisa:** Variações (manga curta, longa, justa, folgada).
- **Calção:** Geometria separada da camisa, permitindo físicas simples (se necessário) e texturas variadas.
- **Meião:** Sobrepondo a perna.
- **Chuteiras:** Geometria dedicada para facilitar trocas de modelos/marcas.
- **Luvas:** Para goleiros ou jogadores no frio.
- **Braçadeira:** Item isolado para o capitão.

---

## Materiais
O uso de materiais deve ser estrito para manter a leveza:
- **Evitar shaders pesados:** Sem físicas complexas de tecido reais ou refrações.
- Utilizar `MeshStandardMaterial` ou equivalentes otimizados (`MeshLambertMaterial` / custom matcap) dependendo do budget de performance.
- As texturas (quando presentes) devem ser atlases ou paletas de cores globais.

---

## Iluminação
A apresentação do avatar (no menu e cutscenes) deve usar um setup estilo estúdio esportivo:
- **Luz principal (Key Light):** Forte e dramática.
- **Luz de recorte (Rim Light):** Fundamental para destacar a silhueta do personagem contra o fundo.
- **Luz ambiente (Fill Light):** Suave para não deixar as sombras totalmente pretas.

---

## Animações
O esqueleto precisará de suporte (via animação tradicional de ossos ou blend shapes faciais) para ações como:
- **Idle:** Postura base de menu (confiante, relaxado).
- **Respiração:** Movimento sutil do peito.
- **Piscar:** Essencial para a vida do personagem.
- **Olhar (Look At):** Head tracking acompanhando a câmera ou bola.
- **Comemorar:** Conjunto de animações de gol.
- **Segurar troféu / Segurar camisa / Acenar:** Interações de progressão e menus.

---

## Performance
**Metas:**
- **60 FPS** consistentes, mesmo em dispositivos de médio porte.
- Carregamento rápido (arquivos GLTF/GLB compactados e draco-compressed).
- Baixo uso de memória: instanciamento quando houver múltiplos jogadores (em partidas).
- **LOD (Level of Detail) preparado para o futuro:** Modelos devem ter versões de baixa contagem de polígonos para câmeras distantes durante o jogo.

---

## Fallback
Se o WebGL não estiver disponível ou falhar (ou dispositivo muito fraco):
- Mostrar um retrato 2D do jogador (pode ser pré-renderizado ou composto via canvas 2D).
- Nunca deixar uma tela branca ou estourar a aplicação.

---

## Arquitetura Recomendada

O sistema deve isolar a lógica de dados, gerenciamento de assets e a visualização no React Three Fiber:

- **Model (`core/domain/avatar`):** Entidade pura contendo os dados e configurações do personagem (IDs de cabelo, cor de pele, medidas).
- **Appearance (`core/domain/appearance`):** Regras de validação (quais combinações são possíveis, paletas de cores válidas).
- **Animation (`components/3d/anim`):** State machine responsável por misturar Idles, transições e reações.
- **Equipment (`components/3d/equipment`):** Gerenciador e loader das partes separadas (camisa, calção, chuteira).
- **Renderer (`components/3d/Renderer`):** Configuração de luzes de estúdio, shaders customizados de pele.
- **LOD (`components/3d/LODManager`):** Troca os meshes baseado na distância da câmera (útil para expansão futura do gameplay 3D).
- **Customization (`presentation/features/avatar`):** A UI do React responsável por criar e editar o avatar.
