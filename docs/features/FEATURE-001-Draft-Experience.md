# FEATURE-001: Experiência de Draft e Sistema de DNA

## Visão Geral
Esta funcionalidade reformula e expande o atual sistema de Criação de Jogador, introduzindo uma escolha baseada em dois modos de Draft (Quick e Complete), o conceito de Blind Draft, e o novo sistema de "Player DNA", que traz modificadores comportamentais e contextuais baseados nas escolhas realizadas pelo usuário durante a criação do jogador.

## Modos de Draft

A tela `CreationDraftLength` oferecerá dois modos fundamentais:

### 1. QUICK DRAFT
Focado em uma experiência rápida e ágil, com 8 categorias principais:
1. **PAC (Pace / Ritmo)**
2. **SHO (Shooting / Finalização)**
3. **PAS (Passing / Passe)**
4. **DRI (Dribbling / Drible)**
5. **DEF (Defending / Defesa)**
6. **PHY (Physical / Físico)**
7. **Skill Moves (Fintas)**
8. **Weak Foot (Perna Ruim)**

Os demais sub-atributos são extrapolados de maneira proporcional ao valor do atributo base escolhido e ao perfil posicional do jogador criado.

### 2. COMPLETE DRAFT
Focado em simulação profunda (cerca de 20 atributos individuais escolhidos um a um), permitindo total personalização:
- **Técnicos:** Finalização, Chute Longe, Voleio, Pênalti, Falta, Cruzamento, Passe Curto, Passe Longo, Curva, Controle de Bola, Drible, Marcação, Dividida em Pé, Carrinho, Cabeceio.
- **Físicos/Mentais:** Aceleração, Pique, Agilidade, Equilíbrio, Reação, Posicionamento, Visão, Força, Fôlego, Impulsão, Agressividade.

## BLIND DRAFT (Mecânica de Escolha)
Para aumentar a tensão e a gamificação da montagem do jogador, as cartas do draft serão apresentadas como **Blind Draft**.

### 1. Antes da Escolha (Carta Virada para Cima, Atributo Oculto)
O jogador visualiza 3 ou mais cartas de "Mestres/Ídolos", mostrando as seguintes informações:
- **Jogador:** Nome do ídolo (ex: Ronaldo, Zidane, Maldini).
- **Foto/Retrato:** Imagem ou ilustração minimalista.
- **Nacionalidade:** Bandeira e/ou nome.
- **Posição / Época:** Posição onde o jogador se destacou e o ano/fase (ex: ST - 2002).
- **Atributo:** O valor do atributo alvo estará oculto, exibido como `???`.

### 2. Depois da Escolha (Revelação e Aplicação)
Ao confirmar a escolha, a carta revela os dados completos:
- **Valor e Atributo:** O número real que o ídolo cede e o atributo em questão (ex: 94 DRI).
- **DNA Obtido:** (Vide Sistema de Player DNA abaixo).
- **Impacto no Overall:** Incremento no OVR estimado no painel lateral (+2 OVR).
- **Animação de Aplicação:** Partículas ou feixes de energia viajando da carta para a ficha do avatar.

## Sistema de Player DNA
Além do valor numérico dos atributos, certas cartas de ídolos injetam "DNA" no jogador. 

O DNA é composto por:
- **Traits (Características Ativas):** Ex: "Finesse Shot" (Chute Colocado), "Outside Foot" (Trivela).
- **Tendências:** Comportamentos em simulações (ex: "Tende a reter a bola", "Desce para receber").
- **Modificadores Situacionais:** Bônus temporários dependentes de contexto (ex: +5 SHO em finais, +10 PAC nos últimos 15 min se estiver perdendo).
- **Sinergias:** Combinações de DNA (ex: DNA do Xavi + DNA do Iniesta = Bônus extra de Visão de Jogo).
- **Conflitos:** DNAs mutuamente exclusivos (ex: DNA "Trabalho em Equipe" diminui eficiência se pareado com DNA "Fominha/Egoísta").
- **Raridade:** Comum, Épico, Lendário (afeta o impacto visual e estatístico).
- **Origem:** O ídolo de onde aquele DNA veio.

---

## Definições Técnicas e Arquitetura

### Estados e Modelo de Dados
- Ampliar `GameState` -> `player.dna` (`PlayerDNA[]`).
- Modificar fase atual: Em vez de array simples de atributos iteráveis, o estado gerenciará uma fila (Queue) de atributos pendentes (8 para QUICK, ~20 para COMPLETE).
- Estado de visualização da UI: `REVEALING`, `APPLYING`, `TRANSITIONING`.

### Fluxo do Draft
1. Inicializar Fila de Atributos dependendo do modo (QUICK ou COMPLETE).
2. Para cada atributo da fila: 
   - O gerador cria as opções de Ídolos compatíveis (ver "Geração de Opções").
   - O usuário vê as opções no formato Blind Draft.
   - Seleciona uma carta.
   - UI entra em estado de `REVEALING` -> Mostra valor e DNA.
   - UI entra em estado `APPLYING` -> Anima para o painel de status.
   - Avança para o próximo atributo.

### Prevenção de Escolhas Inválidas
- Desativar interações na tela enquanto as animações de `REVEALING` ou `APPLYING` estiverem em andamento.
- Tratamento de reconexão / reload: salvar o índice atual no `saveSlot` (temporário ou auto-save) caso o usuário recarregue a página no meio do draft.

### Geração de Opções e Balanceamento
- **Pool Base:** Filtra ídolos que possuam um rating alto no atributo atual.
- **RNG e Balanceamento:**
  - O gerador nunca deve oferecer apenas cartas ruins ou apenas lendárias. A distribuição deve ser controlada (ex: sempre 1 garantida de alto nível, e outras 2 com variância).
  - A variação de `???` a ser revelada deve sempre obedecer limites realistas (um atacante de elite não cederá 30 de finalização, mas algo entre 80-95).
- **Repetição:** Ídolos já utilizados para ceder DNA/atributos numa escolha anterior têm sua probabilidade drasticamente reduzida (ou a zero) para não monopolizarem o draft (ex: Você não pode pegar PAC, SHO e DRI apenas do Messi).

### Acessibilidade
- O usuário deve conseguir focar nas cartas usando a tecla `Tab`.
- Seleção através de `Enter` ou `Space`.
- As animações de `REVEALING` e partículas devem respeitar `prefers-reduced-motion` no CSS, fazendo cortes diretos (sem transições lentas) caso ativado no OS do usuário.
- Uso correto de `aria-label` e `aria-hidden` para estados `???` x Revelados.

### Animações e Áudio (Opcionais)
- **Framer Motion (`motion/react`):** 
  - Cartas entram via `popLayout` (como no modelo atual).
  - 3D Flip (rotateY de 0 a 180) ao revelar.
  - "Flying Sparks": após revelar, elemento visual voa em direção ao painel da direita para sinalizar a absorção do atributo.
- **Sons Opcionais:** Sons curtos e não intrusivos usando a Web Audio API ou HTML5 Audio:
  - `hover.mp3`
  - `card_flip.mp3`
  - `dna_absorb.mp3`

### Desempenho e Comportamento Mobile
- **Performance:** Evitar re-renderizações desnecessárias do painel da direita. Usar `useMemo` para calcular o OVR estimado. O uso do Framer Motion será restrito à entrada/saída de cartas (DOM elements curtos).
- **Mobile:**
  - Em telas pequenas (`md` para baixo), a UI empilhará as cartas verticalmente ou as alinhará em formato de carrossel ou grade (2x2) ao invés de display horizontal.
  - O painel lateral passará a ser uma barra inferior fixa (bottom sheet) mostrando o OVR e os pontos mais importantes, enquanto os detalhes ficarão colapsados para economizar espaço de tela.

### Critérios de Aceite
1. O usuário pode escolher entre Quick (8 passos) e Complete (~20 passos).
2. As cartas são mostradas em Blind Draft, exibindo inicialmente "???".
3. Ao clicar, a animação de flip revela o atributo numérico e (se houver) a tag de Player DNA.
4. O valor do atributo e o OVR Estimado no painel refletem corretamente a escolha.
5. As mecânicas funcionam de ponta a ponta sem estado inválido caso cliques rápidos ocorram (bloqueio de UI).
6. A tela final de Criação deve consolidar os atributos e os DNAs adquiridos no `GameState`.

### Estratégia de Testes
- **Testes Unitários:**
  - Testar a lógica de Geração de Cartas (garantir que não haja repetições inválidas).
  - Testar o cálculo de `OVR Estimado` considerando multiplicadores de posição.
- **Testes de Integração:**
  - Montar o `CreationAttributes` e simular cliques em sequência.
  - Verificar a transição de modos e a atualização do estado global no `useGameEngine`.
- **Testes de Componente:**
  - Garantir que a carta possua os textos corretos pré e pós-clique.
  - Validar as classes CSS (Tailwind) e se a renderização mobile ajusta o flex-direction corretamente.
