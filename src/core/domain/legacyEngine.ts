import { SeasonRecord } from '../../types';

export type LegacyCategory = 'CLUB_LEGEND' | 'NATIONAL_HERO' | 'GLOBAL_ICON' | 'ERA_DOMINATOR';

export interface LegacyEvent {
  year: number;
  category: LegacyCategory;
  type: 'TITLE' | 'AWARD' | 'MILESTONE' | 'RECORD';
  name: string;
  points: number;
  description: string;
}

export interface LegacyScore {
  clubLegend: number;
  nationalHero: number;
  globalIcon: number;
  eraDominator: number;
  totalGoatScore: number;
}

export interface CareerSummary {
  totalGoals: number;
  totalAssists: number;
  totalMatches: number;
  totalTrophies: number;
  ballonDors: number;
  worldCups: number;
  championsLeagues: number;
  yearsActive: number;
  averageRating: number;
  totalCaptaincies: number;
}

export interface LegacyState {
  events: LegacyEvent[];
  score: LegacyScore;
  summary: CareerSummary;
  records: string[]; 
  milestones: string[];
  hallOfFameLevel: 'NONE' | 'NOMINEE' | 'INDUCTEE' | 'LEGEND' | 'GOAT';
}

export class LegacyEngine {
  
  public static calculateLegacy(history: SeasonRecord[]): LegacyState {
    const events: LegacyEvent[] = [];
    const score: LegacyScore = { clubLegend: 0, nationalHero: 0, globalIcon: 0, eraDominator: 0, totalGoatScore: 0 };
    const summary: CareerSummary = {
      totalGoals: 0, totalAssists: 0, totalMatches: 0, totalTrophies: 0,
      ballonDors: 0, worldCups: 0, championsLeagues: 0, yearsActive: 0,
      averageRating: 0, totalCaptaincies: 0
    };
    
    let totalRatingSum = 0;
    const records = new Set<string>();
    const milestones = new Set<string>();

    let consecutivePeakYears = 0;
    let maxConsecutivePeakYears = 0;
    let ballonDorStreak = 0;
    let maxBallonDorStreak = 0;
    
    // Club tracking for loyalty
    const clubYears = new Map<string, number>();

    const sortedHistory = [...history].sort((a, b) => a.year - b.year);

    for (const season of sortedHistory) {
      if (season.matchesPlayed === 0) continue;
      
      summary.yearsActive++;
      summary.totalGoals += season.goals;
      summary.totalAssists += season.assists;
      summary.totalMatches += season.matchesPlayed;
      summary.totalCaptaincies += season.captaincies;
      totalRatingSum += (season.avgRating * season.matchesPlayed);
      
      clubYears.set(season.clubId, (clubYears.get(season.clubId) || 0) + 1);

      // --- Peak / Consistency Analysis ---
      if (season.avgRating >= 8.0 && season.matchesPlayed > 20) {
        consecutivePeakYears++;
        maxConsecutivePeakYears = Math.max(maxConsecutivePeakYears, consecutivePeakYears);
      } else {
        consecutivePeakYears = 0;
      }

      // --- Trophies ---
      for (const trophy of season.trophies) {
        summary.totalTrophies++;
        
        let pts = 0;
        let category: LegacyCategory = 'CLUB_LEGEND';
        let desc = '';

        if (trophy.includes('World Cup') || trophy.includes('Copa do Mundo')) {
          summary.worldCups++;
          pts = 500;
          category = 'NATIONAL_HERO';
          desc = 'Conquistou o maior torneio de seleções do mundo.';
        } else if (trophy.includes('Copa America') || trophy.includes('Euro')) {
          pts = 300;
          category = 'NATIONAL_HERO';
          desc = 'Conquistou título continental com a seleção.';
        } else if (trophy.includes('Champions League') || trophy.includes('Libertadores')) {
          summary.championsLeagues++;
          pts = 400;
          category = 'GLOBAL_ICON';
          desc = 'Conquistou o torneio continental de clubes mais prestigiado.';
        } else if (trophy.includes('Liga') || trophy.includes('League') || trophy.includes('Serie') || trophy.includes('Bundesliga')) {
          pts = 200;
          category = 'CLUB_LEGEND';
          desc = 'Venceu o campeonato nacional.';
        } else {
          pts = 50;
          category = 'CLUB_LEGEND';
          desc = 'Venceu uma copa nacional ou torneio menor.';
        }
        
        // Captaincy bonus for titles
        if (season.captaincies >= season.matchesPlayed * 0.5) {
          pts = Math.floor(pts * 1.5);
          desc += ' Ergueu a taça como capitão!';
        }

        events.push({ year: season.year, category, type: 'TITLE', name: trophy, points: pts, description: desc });
        this.addScore(score, category, pts);
      }

      // --- Awards ---
      let wonBallonDor = false;
      for (const award of season.awards) {
        let pts = 0;
        let category: LegacyCategory = 'GLOBAL_ICON';
        let desc = '';

        if (award === 'Ballon d\'Or' || award === 'Melhor do Mundo') {
          summary.ballonDors++;
          wonBallonDor = true;
          pts = 1000;
          category = 'ERA_DOMINATOR';
          desc = 'Eleito o melhor jogador do mundo.';
        } else if (award === 'Golden Boot' || award === 'Artilheiro') {
          pts = 300;
          category = 'ERA_DOMINATOR';
          desc = 'Terminou a temporada como artilheiro.';
        } else if (award === 'TOTY' || award === 'Equipe do Ano') {
          pts = 200;
          category = 'GLOBAL_ICON';
          desc = 'Eleito para a seleção do ano.';
        } else {
          pts = 100;
          desc = 'Venceu um prêmio individual.';
        }

        events.push({ year: season.year, category, type: 'AWARD', name: award, points: pts, description: desc });
        this.addScore(score, category, pts);
      }

      if (wonBallonDor) {
        ballonDorStreak++;
        maxBallonDorStreak = Math.max(maxBallonDorStreak, ballonDorStreak);
      } else {
        ballonDorStreak = 0;
      }

      // --- Milestones ---
      if (summary.totalGoals >= 100 && !milestones.has('100_GOALS')) {
        milestones.add('100_GOALS');
        const pts = 200;
        events.push({ year: season.year, category: 'GLOBAL_ICON', type: 'MILESTONE', name: '100 Gols na Carreira', points: pts, description: 'Alcançou a marca de 100 gols oficiais.' });
        this.addScore(score, 'GLOBAL_ICON', pts);
      }
      if (summary.totalGoals >= 500 && !milestones.has('500_GOALS')) {
        milestones.add('500_GOALS');
        const pts = 1000;
        events.push({ year: season.year, category: 'GLOBAL_ICON', type: 'MILESTONE', name: '500 Gols na Carreira', points: pts, description: 'Lenda viva! Alcançou 500 gols oficiais.' });
        this.addScore(score, 'GLOBAL_ICON', pts);
      }
      if (summary.totalGoals >= 1000 && !milestones.has('1000_GOALS')) {
        milestones.add('1000_GOALS');
        const pts = 5000;
        events.push({ year: season.year, category: 'GLOBAL_ICON', type: 'MILESTONE', name: '1000 Gols na Carreira', points: pts, description: 'Pelé? Romário? Você é o Rei dos Gols!' });
        this.addScore(score, 'GLOBAL_ICON', pts);
      }
      if (summary.totalMatches >= 500 && !milestones.has('500_MATCHES')) {
        milestones.add('500_MATCHES');
        const pts = 300;
        events.push({ year: season.year, category: 'CLUB_LEGEND', type: 'MILESTONE', name: '500 Jogos Oficiais', points: pts, description: 'Marcou época com sua longevidade.' });
        this.addScore(score, 'CLUB_LEGEND', pts);
      }

      // --- Seasonal Records ---
      if (season.goals >= 50 && !records.has('50_GOALS_SEASON')) {
        records.add('50_GOALS_SEASON');
        const pts = 500;
        events.push({ year: season.year, category: 'ERA_DOMINATOR', type: 'RECORD', name: '50 Gols em uma Temporada', points: pts, description: 'Temporada histórica em número de gols.' });
        this.addScore(score, 'ERA_DOMINATOR', pts);
      }
      if (season.goals >= 90 && !records.has('90_GOALS_SEASON')) {
         records.add('90_GOALS_SEASON');
         const pts = 2000;
         events.push({ year: season.year, category: 'ERA_DOMINATOR', type: 'RECORD', name: 'Mais de 90 Gols no Ano', points: pts, description: 'Quebrou o recorde lendário de gols em um único ano!' });
         this.addScore(score, 'ERA_DOMINATOR', pts);
      }
      if (season.assists >= 30 && !records.has('30_ASSISTS_SEASON')) {
        records.add('30_ASSISTS_SEASON');
        const pts = 400;
        events.push({ year: season.year, category: 'ERA_DOMINATOR', type: 'RECORD', name: '30 Assistências em uma Temporada', points: pts, description: 'Playmaker absoluto, servindo os companheiros.' });
        this.addScore(score, 'ERA_DOMINATOR', pts);
      }
    }

    if (summary.totalMatches > 0) {
      summary.averageRating = totalRatingSum / summary.totalMatches;
    }

    // --- End of Career Bonuses ---
    let loyaltyBonus = 0;
    clubYears.forEach((years, club) => {
      if (years >= 10) {
        loyaltyBonus += 1000; // One club man or long tenure
        if (!records.has(`ONE_CLUB_MAN_${club}`)) {
           events.push({ year: sortedHistory.length > 0 ? sortedHistory[sortedHistory.length - 1].year : 2024, category: 'CLUB_LEGEND', type: 'MILESTONE', name: 'Lealdade (10+ Anos)', points: 1000, description: 'Tornou-se o maior símbolo do clube.' });
           records.add(`ONE_CLUB_MAN_${club}`);
        }
      }
    });
    this.addScore(score, 'CLUB_LEGEND', loyaltyBonus);

    // Consistency Bonus
    if (maxConsecutivePeakYears >= 5) {
      const pts = maxConsecutivePeakYears * 200;
      events.push({ year: sortedHistory.length > 0 ? sortedHistory[sortedHistory.length - 1].year : 2024, category: 'ERA_DOMINATOR', type: 'MILESTONE', name: 'Consistência de Elite', points: pts, description: `Manteve um nível absurdo (Média > 8.0) por ${maxConsecutivePeakYears} anos seguidos.` });
      this.addScore(score, 'ERA_DOMINATOR', pts);
    }

    // Three-peat Ballon d'Or
    if (maxBallonDorStreak >= 3) {
      const pts = maxBallonDorStreak * 500;
      events.push({ year: sortedHistory.length > 0 ? sortedHistory[sortedHistory.length - 1].year : 2024, category: 'ERA_DOMINATOR', type: 'RECORD', name: 'Hegemonia de Ouro', points: pts, description: `Venceu a Bola de Ouro ${maxBallonDorStreak} vezes seguidas.` });
      this.addScore(score, 'ERA_DOMINATOR', pts);
    }

    // Calculate Total GOAT Score
    score.totalGoatScore = score.clubLegend + score.nationalHero + score.globalIcon + score.eraDominator;

    // Add multipliers for well-rounded careers
    if (score.clubLegend > 2000 && score.nationalHero > 1000 && score.globalIcon > 2000 && score.eraDominator > 2000) {
       const synergy = Math.floor(score.totalGoatScore * 0.2); // 20% bonus for having everything
       events.push({ year: sortedHistory.length > 0 ? sortedHistory[sortedHistory.length - 1].year : 2024, category: 'ERA_DOMINATOR', type: 'MILESTONE', name: 'Carreira Completa', points: synergy, description: 'Brilhou intensamente por clubes, seleção e individualmente.' });
       score.totalGoatScore += synergy;
    }

    // Hall of Fame classification
    let hof: 'NONE' | 'NOMINEE' | 'INDUCTEE' | 'LEGEND' | 'GOAT' = 'NONE';
    if (score.totalGoatScore >= 30000) hof = 'GOAT';
    else if (score.totalGoatScore >= 15000) hof = 'LEGEND';
    else if (score.totalGoatScore >= 8000) hof = 'INDUCTEE';
    else if (score.totalGoatScore >= 4000) hof = 'NOMINEE';

    return {
      events: events.sort((a, b) => a.year - b.year),
      score,
      summary,
      records: Array.from(records),
      milestones: Array.from(milestones),
      hallOfFameLevel: hof
    };
  }

  private static addScore(score: LegacyScore, cat: LegacyCategory, pts: number) {
    if (cat === 'CLUB_LEGEND') score.clubLegend += pts;
    else if (cat === 'NATIONAL_HERO') score.nationalHero += pts;
    else if (cat === 'GLOBAL_ICON') score.globalIcon += pts;
    else if (cat === 'ERA_DOMINATOR') score.eraDominator += pts;
  }
}
