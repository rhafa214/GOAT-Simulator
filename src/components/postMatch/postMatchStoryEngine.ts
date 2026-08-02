import { GameState, MatchStats, NewsItem } from '../../types';

export type PostMatchLevel = 'COMPACT' | 'COMPLETE' | 'HISTORIC';

export interface GeneratedMatchStory {
  level: PostMatchLevel;
  homeScore: number;
  awayScore: number;
  userClubScore: number;
  opponentScore: number;
  resultType: 'VICTORY' | 'DRAW' | 'DEFEAT';
  resultLabel: string;
  resultColor: string;
  headline: string;
  decisiveMoment: string;
  historicNarrative: string;
  trophyWon?: string;
  milestone?: string;
  events: { id: string; minute: number; type: 'GOAL' | 'ASSIST' | 'YELLOW_CARD' | 'RED_CARD' | 'INJURY' | 'SUB_IN' | 'SUB_OUT'; player: string; isUser?: boolean }[];
  standingsImpact: {
    position: number;
    points: number;
    pointsGained: number;
    positionChange: string;
  };
  evolution: {
    xpGained: number;
    moraleChange: number;
    fitnessDrain: number;
    currentMorale: number;
    currentFitness: number;
  };
  records: string[];
  newsItem?: NewsItem;
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function enforceWordLimit(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ');
}

export function detectPostMatchStoryLevel(match: MatchStats): PostMatchLevel {
  const isFinal = match.importance === 'FINAL' 
    || match.competition.toLowerCase().includes('final')
    || Boolean(match.trophyWon);
    
  const isHistoricPerformance = Boolean(match.isHistoric) 
    || Boolean(match.milestone) 
    || (match.goals >= 3) 
    || match.rating >= 9.8;

  if (isFinal || isHistoricPerformance) {
    return 'HISTORIC';
  }

  const isImportantContext = match.importance === 'DERBY' 
    || match.importance === 'HIGH' 
    || match.opponent.toLowerCase().includes('clássico')
    || match.opponent.toLowerCase().includes('derby')
    || match.motm
    || match.rating >= 8.2
    || match.goals >= 2
    || match.assists >= 2;

  if (isImportantContext) {
    return 'COMPLETE';
  }

  return 'COMPACT';
}

export function generateMatchStory(state: GameState, match: MatchStats): GeneratedMatchStory {
  const level = detectPostMatchStoryLevel(match);
  const player = state.player;
  const club = state.career.currentClub;
  const clubName = club?.name || 'Seu Clube';

  // Determine scores
  let homeScore = match.homeScore ?? (match.goals + (match.rating > 7 ? 1 : 0));
  let awayScore = match.awayScore ?? (match.home ? (match.rating < 6 ? 2 : 0) : match.goals + 1);

  if (match.homeScore === undefined) {
    if (match.home) {
      homeScore = match.goals + (match.assists > 0 ? 1 : 0);
      awayScore = match.rating >= 7.5 ? Math.max(0, homeScore - 1) : homeScore + 1;
    } else {
      awayScore = match.goals + (match.assists > 0 ? 1 : 0);
      homeScore = match.rating >= 7.5 ? Math.max(0, awayScore - 1) : awayScore + 1;
    }
  }

  const userClubScore = match.home ? homeScore : awayScore;
  const opponentScore = match.home ? awayScore : homeScore;

  let resultType: 'VICTORY' | 'DRAW' | 'DEFEAT' = 'DRAW';
  let resultLabel = 'Empate';
  let resultColor = 'text-zinc-300';

  if (userClubScore > opponentScore) {
    resultType = 'VICTORY';
    resultLabel = 'Vitória';
    resultColor = 'text-emerald-400';
  } else if (userClubScore < opponentScore) {
    resultType = 'DEFEAT';
    resultLabel = 'Derrota';
    resultColor = 'text-rose-500';
  }

  // Generate / format Timeline Events
  const events = [...(match.events || [])];
  if (events.length === 0) {
    if (match.goals > 0) {
      for (let g = 0; g < match.goals; g++) {
        events.push({
          id: `ev_g_${g}`,
          minute: Math.min(88, 18 + g * 32),
          type: 'GOAL',
          player: player.name,
          isUser: true
        });
      }
    }
    if (match.assists > 0) {
      for (let a = 0; a < match.assists; a++) {
        events.push({
          id: `ev_a_${a}`,
          minute: Math.min(85, 29 + a * 25),
          type: 'ASSIST',
          player: player.name,
          isUser: true
        });
      }
    }
    if (match.yellowCards && match.yellowCards > 0) {
      events.push({
        id: `ev_yc`,
        minute: 62,
        type: 'YELLOW_CARD',
        player: player.name,
        isUser: true
      });
    }
    if (match.redCards && match.redCards > 0) {
      events.push({
        id: `ev_rc`,
        minute: 84,
        type: 'RED_CARD',
        player: player.name,
        isUser: true
      });
    }
    if (match.injured) {
      events.push({
        id: `ev_inj`,
        minute: match.minutesPlayed,
        type: 'INJURY',
        player: player.name,
        isUser: true
      });
    }
  }
  events.sort((a, b) => a.minute - b.minute);

  // Standings impact simulation
  const pointsGained = resultType === 'VICTORY' ? 3 : resultType === 'DRAW' ? 1 : 0;
  const approxStandingPos = Math.max(1, Math.min(20, 5 - Math.floor(match.rating / 2)));
  const positionChange = resultType === 'VICTORY' ? '+1 posição' : resultType === 'DEFEAT' ? '-1 posição' : 'Manteve posição';

  // Evolution & RPG shifts
  const xpGained = Math.round(match.rating * 15 + match.goals * 25 + match.assists * 15 + (match.motm ? 30 : 0));
  const moraleChange = resultType === 'VICTORY' ? 5 : resultType === 'DEFEAT' ? -4 : 1;
  const fitnessDrain = Math.round((match.minutesPlayed / 90) * 15);

  // Milestone & Records
  const records: string[] = [];
  if (match.motm) records.push('Homem do Jogo (MOTM)');
  if (match.goals >= 3) records.push('Hat-Trick Histórico');
  else if (match.goals === 2) records.push('Dobradinha Decisiva');
  if (match.rating >= 9.0) records.push(`Atuação Nota ${match.rating.toFixed(1)}`);
  if (match.trophyWon) records.push(`Campeão: ${match.trophyWon}`);
  if (match.milestone) records.push(match.milestone);

  // News engine match lookup
  const matchNews = state.narrative.news.find(
    n => n.category === 'partida' || n.category === 'título' || n.category === 'recorde'
  );

  // Text Generators with strict limits:
  // Headline <= 12 words
  // Decisive Moment / Summary <= 45 words
  // Historic Narrative <= 80 words

  let headline = match.headline || matchNews?.headline;
  if (!headline) {
    if (level === 'HISTORIC') {
      headline = resultType === 'VICTORY'
        ? `Inesquecível! ${player.name} brilha e lidera o ${clubName} ao título épico!`
        : `Batalha histórica! ${player.name} dá tudo em campo em decisão memorável!`;
    } else if (level === 'COMPLETE') {
      headline = resultType === 'VICTORY'
        ? `Show no clássico! ${player.name} comanda a grande vitória do ${clubName}!`
        : `Duelo eletrizante! ${clubName} e ${match.opponent} fazem partida intensa no campeonato.`;
    } else {
      headline = resultType === 'VICTORY'
        ? `${clubName} vence o ${match.opponent} com atuação segura de ${player.name}.`
        : `${clubName} empata com ${match.opponent} em jogo disputado na rodada.`;
    }
  }
  headline = enforceWordLimit(headline, 12);

  let decisiveMoment = match.decisiveMoment || matchNews?.summary;
  if (!decisiveMoment) {
    if (match.goals > 0) {
      decisiveMoment = `No momento mais quente da partida, ${player.name} apareceu com precisão cirúrgica para balançar as redes. O lance incendiou a torcida do ${clubName} e selou o resultado final por ${userClubScore} a ${opponentScore}.`;
    } else if (match.assists > 0) {
      decisiveMoment = `Com uma visão de jogo apurada, ${player.name} encontrou o companheiro livre na área para servir a assistência decisiva no placar de ${userClubScore} a ${opponentScore}.`;
    } else {
      decisiveMoment = `Mesmo sob forte pressão do adversário, a entrega e consistência tática de ${player.name} foram fundamentais para manter o equilíbrio no confronto do ${clubName}.`;
    }
  }
  decisiveMoment = enforceWordLimit(decisiveMoment, 45);

  let historicNarrative = match.historicNarrative;
  if (!historicNarrative) {
    historicNarrative = `Uma noite cravada na história do futebol. Com controle técnico absoluto e frieza nos momentos de decisão, ${player.name} liderou o ${clubName} em um confronto memorável diante do ${match.opponent}. O desempenho com nota ${match.rating.toFixed(1)} e contribuição direta nos gols eternizam este momento na galeria de grandes jogos do jovem atleta.`;
  }
  historicNarrative = enforceWordLimit(historicNarrative, 80);

  return {
    level,
    homeScore,
    awayScore,
    userClubScore,
    opponentScore,
    resultType,
    resultLabel,
    resultColor,
    headline,
    decisiveMoment,
    historicNarrative,
    trophyWon: match.trophyWon || (level === 'HISTORIC' ? match.competition : undefined),
    milestone: match.milestone || (match.goals >= 3 ? 'Hat-Trick em Jogo Grande' : undefined),
    events,
    standingsImpact: {
      position: approxStandingPos,
      points: pointsGained * 3 + 12,
      pointsGained,
      positionChange
    },
    evolution: {
      xpGained,
      moraleChange,
      fitnessDrain,
      currentMorale: Math.min(100, Math.max(0, player.rpg.morale + moraleChange)),
      currentFitness: Math.max(0, player.rpg.fitness - fitnessDrain)
    },
    records,
    newsItem: matchNews
  };
}
