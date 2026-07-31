import { GameState, NewsItem, NewsCategory } from '../../types';

export interface NewsEnhancer {
  enhance(news: NewsItem, state: GameState): Promise<NewsItem>;
}

export interface NewsTemplate {
  category: NewsCategory;
  condition: (state: GameState, context?: any) => boolean;
  generate: (state: GameState, context?: any) => Omit<NewsItem, 'id' | 'date' | 'week' | 'year' | 'read'>;
}

export const NEWS_TEMPLATES: NewsTemplate[] = [
  {
    category: 'partida',
    condition: (state, context) => context?.type === 'match',
    generate: (state, context) => {
      const stats = context.stats;
      const isWin = stats?.goals > 0;
      const club = state.career.currentClub?.name || 'Clube';
      return {
        headline: `${club} ${isWin ? 'Garante Vitória' : 'Tropeça'}`,
        summary: `A atuação de ${state.player.name} foi o assunto do momento após a última partida.`,
        category: 'partida',
        relatedEntities: [club, state.player.name],
        importance: 3,
        source: 'Tribuna Esportiva'
      };
    }
  },
  {
    category: 'partida',
    condition: (state, context) => context?.type === 'match_goals' && context?.stats?.goals > 1,
    generate: (state, context) => {
      const goals = context.stats.goals;
      return {
        headline: `Show de ${state.player.name}: ${goals} Gols!`,
        summary: `Uma atuação de gala. Os torcedores aplaudiram de pé a performance fenomenal.`,
        category: 'partida',
        relatedEntities: [state.player.name],
        importance: 4,
        source: 'Bola na Rede'
      };
    }
  },
  {
    category: 'lesão',
    condition: (state, context) => context?.type === 'injury',
    generate: (state, context) => {
      return {
        headline: `Preocupação: ${state.player.name} se machuca`,
        summary: `A torcida lamenta a lesão recente e espera um retorno rápido aos gramados.`,
        category: 'lesão',
        relatedEntities: [state.player.name],
        importance: 5,
        source: 'Diário Médico'
      };
    }
  },
  {
    category: 'rumor',
    condition: (state) => state.player.rpg.fame > 50,
    generate: (state) => {
      return {
        headline: `Futuro de ${state.player.name} em Jogo?`,
        summary: `Fontes próximas indicam que gigantes europeus estão de olho na jovem promessa.`,
        category: 'rumor',
        relatedEntities: [state.player.name],
        importance: 2,
        source: 'Fofoca FC'
      };
    }
  },
  {
    category: 'entrevista',
    condition: (state) => state.player.rpg.morale > 70,
    generate: (state) => {
      return {
        headline: `"${state.player.name}: Estou Vivendo um Sonho"`,
        summary: `O atleta deu uma entrevista exclusiva reafirmando seu compromisso com o clube.`,
        category: 'entrevista',
        relatedEntities: [state.player.name],
        importance: 2,
        source: 'Revista do Craque'
      };
    }
  }
];

export class NewsEngine {
  private enhancer: NewsEnhancer | null = null;
  private nextId = 1;

  public setEnhancer(enhancer: NewsEnhancer) {
    this.enhancer = enhancer;
  }

  public generateNews(state: GameState, rng: { random: () => number }, context?: any): NewsItem | null {
    const eligible = NEWS_TEMPLATES.filter(t => t.condition(state, context));
    if (eligible.length === 0) return null;

    const template = eligible[Math.floor(rng.random() * eligible.length)];
    const partial = template.generate(state, context);
    
    const idStr = `news_${state.career.year}_${state.career.week}_${this.nextId++}`;
    
    const news: NewsItem = {
      ...partial,
      id: idStr,
      week: state.career.week,
      year: state.career.year,
      date: `Semana ${state.career.week}, ${state.career.year}`
    };

    return news;
  }

  public async enhanceNews(news: NewsItem, state: GameState): Promise<NewsItem> {
    if (!this.enhancer) return news;
    try {
      return await this.enhancer.enhance(news, state);
    } catch (e) {
      console.warn("NewsEnhancer failed, using fallback news", e);
      return news;
    }
  }
}

export const newsEngine = new NewsEngine();
