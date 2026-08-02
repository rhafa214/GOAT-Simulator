# FEATURE-005: Post-Match Storytelling System

## 1. Análise Técnica Completa
A experiência pós-jogo anterior apresentava um resumo estático com métricas básicas (nota, gols, assistências, minutos). A nova arquitetura transforma o pós-jogo em um sistema de **Storytelling Narrativo Inteligente**, capaz de detectar a relevância da partida e apresentá-la em 3 níveis distintos:
1. **Nível 1 - Compacto (Jogos Comuns):** Foco rápido em placar, nota, gols, assistências, cartões, minutos, impactos de Moral/Fitness e próximo compromisso.
2. **Nível 2 - Completo (Jogos Importantes - Clássicos, Mata-Mata):** Inclui estatísticas detalhadas da equipe, linha do tempo dos eventos (gols, cartões, substituições), impacto na tabela de classificação, evolução de atributos e notícia gerada pelo NewsEngine.
3. **Nível 3 - Histórico (Finais, Títulos e Quebra de Recordes):** Adiciona manchete (até 12 palavras), momento decisivo (até 45 palavras), conquista/troféu com brilho dourado, destaque 3D/Portrait do Avatar do jogador e botão "Salvar no Museu".

## 2. Game Design Document (GDD)
- **Objetivo do Jogador:** Sentir o impacto imediato e o drama de cada partida na sua carreira.
- **Regras de Classificação do Nível:**
  - **Histórico (Nível 3):** Se for Final (`isFinal`), Título ganho (`trophyWon`), Quebra de Recorde (`milestone`) ou Nota == 10.0.
  - **Completo (Nível 2):** Se for Clássico (`isDerby`), Mata-mata (`isElimination`), Homem do Jogo (`motm`) com Nota >= 8.5 ou Partida decisiva.
  - **Compacto (Nível 1):** Partidas regulares do campeonato de pontos corridos.
- **Limites Estritos de Texto Narrativo:**
  - **Manchete:** Máximo 12 palavras.
  - **Resumo / Momento Decisivo:** Máximo 45 palavras.
  - **Narrativa Histórica:** Máximo 80 palavras.

## 3. Arquitetura do Sistema
```
[ MatchSimulation / GameEngine ]
             │
             ▼
    [ MatchStats / NewsEngine ]
             │
             ▼
   [ detectPostMatchStoryLevel ] ───► Categorização (Compacto / Completo / Histórico)
             │
   ┌─────────┼──────────────────┐
   ▼         ▼                  ▼
[Level 1] [Level 2]         [Level 3]
Compact   Complete          Historic + Avatar Spotlight + Trophy + Save to Museum
```

## 4. Modelagem de Dados
Extensão da interface `MatchStats` no `src/types.ts`:
```ts
export interface MatchStats {
  id: string;
  week: number;
  year: number;
  competition: string;
  opponent: string;
  opponentLogo?: string;
  home: boolean;
  minutesPlayed: number;
  goals: number;
  assists: number;
  shots: number;
  passes: number;
  passAccuracy: number;
  rating: number;
  motm: boolean;
  injured: boolean;
  wasCaptain: boolean;
  // Campos estendidos de Storytelling:
  homeScore?: number;
  awayScore?: number;
  yellowCards?: number;
  redCards?: number;
  events?: { id: string; minute: number; type: 'GOAL' | 'ASSIST' | 'YELLOW_CARD' | 'RED_CARD' | 'INJURY' | 'SUB_IN' | 'SUB_OUT'; player: string }[];
  importance?: 'LOW' | 'MEDIUM' | 'HIGH' | 'DERBY' | 'FINAL';
  isHistoric?: boolean;
  milestone?: string;
  trophyWon?: string;
  headline?: string;
  decisiveMoment?: string;
  historicNarrative?: string;
  standingsImpact?: {
    prevPosition: number;
    newPosition: number;
    points: number;
  };
}
```

## 5. Descrição de Telas
- **Tela de Pós-Jogo (`PostMatchScreen`):**
  - **Placar Hero & Badge de Resultado:** Vitória (Verde/Gold), Empate (Cinza), Derrota (Vermelho).
  - **Stats Bar:** Nota da partida, minutos, gols, assistências, cartões (amarelos/vermelhos).
  - **Abas / Seções de Detalhe (Níveis 2 e 3):** Eventos em Linha do Tempo, Estatísticas do Confronto, Impacto na Tabela de Classificação, Mudança de Moral/Fitness e Notícia da Mídia.
  - **Showcase Histórico (Nível 3):** Avatar com aura dourada, troféu em 3D/SVG animado, manchete e botão "Salvar no Museu".

## 6. Descrição de Componentes
- `PostMatchScreen`: Controlador principal do fluxo pós-jogo.
- `PostMatchCompact`: Visualização limpa para partidas comuns.
- `PostMatchComplete`: Visualização abrangente para jogos importantes.
- `PostMatchHistoric`: Visualização épica com destaque de Avatar e Troféu.
- `MatchTimelineEvents`: Linha do tempo dos eventos da partida.
- `StandingsImpactCard`: Card ilustrativo de posição na tabela e pontos.
- `NewsEngineAdapter`: Gerador e formatador de manchetes e resumos dentro dos limites de palavras.

## 7. Design System (Goat UI)
- **Cores Dominantes:** Zinc 950/900 background, Amber-400/500 (Destaques e Ouro), Emerald-500 (Vitória), Red-500 (Derrota), Zinc-400 (Neutro).
- **Tipografia:** `font-goat-display` e `font-goat-body` para títulos e métricas.
- **Micro-interações:** Animações de entrada com `motion/react`, efeitos de iluminação e brilho ambiente (`glow`).

## 8. Trade-offs
- **Geração Local de Texto vs. IA Externa:** Opção por templates locais determinísticos com suporte ao `NewsEngine` para garantir tempo de resposta instantâneo e cumprimento estrito dos limites de palavras (12/45/80 palavras) sem custo de latência de rede.
