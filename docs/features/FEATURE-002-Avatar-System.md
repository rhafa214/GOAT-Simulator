# FEATURE-002: Avatar System (3D)

## 1. Visão Geral
O sistema de avatar 3D é o núcleo da identidade visual do jogador no "GOAT Simulator". O objetivo é ter um avatar **semi-estilizado, reconhecível e leve** (otimizado para navegador e mobile), afastando-se do realismo extremo (ex: MetaHuman) para focar em performance, expressividade e flexibilidade. 

O avatar deve refletir o progresso, os atributos, os itens desbloqueados (chuteiras, acessórios) e as customizações feitas no momento da criação, atualizando-se de forma dinâmica na interface (Menu Principal, Criação, Partidas e Eventos).

---

## 2. Auditoria Técnica Atual

A estrutura atual consiste em uma prova de conceito básica baseada em *React Three Fiber* e *drei*:

- **`AvatarModel`**: Atualmente possui um modo *fallback procedural* (geometrias primitivas do Three.js: cilindros e esferas) que reage minimamente a uma animação (`pose`). Existe um esboço para `GLTFAvatar` que está desligado (`useGLB = false`).
- **`AvatarScene`**: Configurações de câmera, iluminação básica (ambientLight, directionalLight), *OrbitControls* para rotação e zoom, e *Environment* "city" do drei. Configuração sólida, mas precisa de ajustes de otimização de renderização.
- **`CreationAppearance`** (e interface): Permite interagir com alguns aspectos do modelo, mas sem reflexo num esqueleto 3D modular real.
- **Tipagem (`PhysicalAppearance`)**: Já existe uma base para atributos físicos (pele, cabelo, acessórios, tatuagens, peso, altura, físico), porém requer expansão e normalização (ex: mapeamento de cores hex, texturas e sub-mesh IDs).
- **Gerenciamento de Estado (`AvatarManager` e similares)**: Atualmente o estado é atrelado ao `GameEngine`. Precisaremos de um controlador específico (`AvatarManager` / `AvatarContext`) voltado para cache, pre-loading, decodificação e montagem das partes modulares antes de enviar para o Three.js.

---

## 3. Arquitetura Modular

Para garantir que o avatar seja modular e performático, ele será composto por uma malha base (*base mesh*) e múltiplos *attachments* / blend shapes (morph targets) para as variações morfológicas.

### 3.1. Estrutura do Personagem
- **Cabeça & Rosto**:
  - Utilizará *morph targets* (blend shapes) no mesh da cabeça base para modificar: **Olhos, Nariz, Boca e Sobrancelhas**.
  - Texturas dinâmicas (Material PBR) para aplicar diferentes tons de **Pele**.
- **Cabelo e Barba**: 
  - Sub-meshes instanciados ou carregados sob demanda. 
  - Tintura baseada na cor escolhida pelo jogador multiplicada pelo mapa de albedo do cabelo/barba (`color` property no `meshStandardMaterial`).
- **Corpo (Altura, Peso, Físico)**:
  - Blend shapes aplicados ao esqueleto principal (rig). "Magra", "Atlética", "Musculosa", "Pesada". 
  - A escala global do esqueleto (`scale={[x, y, z]}`) definirá a **Altura** e o **Peso** ajustará proporcionalmente as dimensões no eixo X e Z, ou através de morph targets corporais para evitar deformações de animação indesejadas.
- **Vestuário (Uniforme & Chuteiras)**:
  - O **Uniforme** (Manga curta, longa, térmica) será tratado com texturas intercambiáveis sobre o mesh de roupa base. Troca dinâmica da textura de albedo e normal map conforme a equipe atual do jogador.
  - **Chuteiras**: Modelos (meshes) independentes anexados aos *bones* dos pés.
- **Acessórios & Tatuagens**:
  - Acessórios (ex: faixa de cabelo, luvas, óculos) anexados diretamente aos ossos respectivos (cabeça, mãos).
  - Tatuagens aplicadas dinamicamente via decalques (*Decals* do Drei) ou via composição de textura overlay aplicada ao material da pele.
- **Animações (Pose & Comemoração)**:
  - O esqueleto deve ser padronizado (ex: formato Mixamo).
  - Controle de animação pelo `useAnimations`. Estados possíveis incluirão *Idle*, *Confident*, *Arms Crossed* e animações completas de **Comemoração**.

---

## 4. Gerenciamento e Componentes

### 4.1. `AvatarManager`
Um serviço singleton (ou hook encapsulado com context, ex: `useAvatarManager()`) encarregado de:
- **Registry**: Mapear os IDs (ex: `hair_01`) para a URL do asset GLB correspondente (`/models/hair/hair_01.glb`).
- **Preload & Cache**: Invocar `useGLTF.preload()` antecipadamente nos bastidores.
- **Composição**: Agregar os estados visuais lógicos vindos da `GameEngine` e traduzir em instruções para o React Three Fiber.

### 4.2. `PlayerAvatar3D` (Componente Raiz do Render)
Refatoração do atual `AvatarModel`:
- Carrega e instancia o `BaseMesh`.
- Agrega as partes conectadas (*children* / *nodes*) baseando-se no dicionário de partes ativas emitido pelo `AvatarManager`.
- Gerencia o *fade-in* (*opacity transition*) para evitar "popping" severo durante o carregamento.

---

## 5. Especificações Técnicas e de Otimização

### 5.1. Performance e Níveis de Qualidade (LOD)
- **Quality Tiers**:
  - *Low* (Mobile/Baixa Performance): Desativa sombras estáticas caras (PCFSoftShadowMap -> BasicShadowMap), reduz Anti-Aliasing (dpr de 1), material básico para a pele.
  - *High* (Desktop): Sombras de contato suaves (`ContactShadows`), mapas normais ativados, iluminação por ambiente HDRI.
- O componente de visualização detectará o frame rate ou definirá automaticamente via capability-check se deve rodar no *Low* ou *High*.

### 5.2. Otimização e Cache
- **Lazy Loading**: Acessórios, chuteiras não padrões e cabelos específicos só serão baixados pelo cliente (`useGLTF`) caso selecionados.
- O *cache* de geometria do React Three Fiber será mantido. `Clone` de instâncias de malhas repetidas para evitar gargalo na placa de vídeo, caso existam múltiplos avatares.

### 5.3. Interação: Rotação, Zoom e Acessibilidade
- **Câmera**: Uso de `OrbitControls` limitados. O zoom máximo não penetrará no rosto e a rotação terá *azimuth* e *polar angle* bloqueados em ângulos estéticos, garantindo a visibilidade.
- **Acessibilidade**: Adição de controles por teclado para interagir com o canvas 3D e rótulos ARIA descrevendo visualmente o avatar renderizado (ex: `<div aria-label="Avatar de um homem alto, cabelo castanho... "/>`).

### 5.4. Iluminação e Ambiente
- **Setup de Iluminação**: Sistema híbrido com um *HDRI Environment map* para luzes de reflexo envolvente + *DirectionalLight* atuando como *key light*.
- Presença sutil de Rim Lighting (luz de fundo) para destacar a silhueta do personagem contra fundos escuros do aplicativo.

### 5.5. Compatibilidade Futura com Animações
- Rigging padronizado. Os ossos mantêm a nomenclatura T-Pose clássica.
- Implementação de blending (transição) fluida de animações utilizando a função `.crossFadeTo()` nativa do Three.js AnimationMixer via `useAnimations` para as transações suaves da tela de "Criação" para "Comemoração".

### 5.6. Assets Ausentes e Fallback
- No cenário de erro de rede ou modelo não encontrado (404), o componente deve fazer fallback instantâneo (via React `ErrorBoundary` / `Suspense`) para um modelo básico de manequim estático ou retornar para o render procedural primitivo (esferas/cilindros), informando visualmente com um ícone de carregamento pendente no canto da interface.

### 5.7. Persistência
- Os dados do `PhysicalAppearance` serão salvos estritamente em um JSON serializável leve no banco de dados, sendo re-parseados localmente. Nenhum dado binário de malha trafegará entre sessão, apenas as referências/IDs morfológicos.
