import { GameState, Position } from '../../types';

export interface MatchObjectives {
  id: string;
  title: string;
  description: string;
  targetRating: number;
  type: 'RATING' | 'GOALS_ASSISTS' | 'PASSES' | 'DEFENCE' | 'TEAM_WIN';
  rewardFame: number;
  rewardMorale: number;
}

export interface MatchTriggers {
  isDebut: boolean;
  isDerby: boolean;
  isKnockout: boolean;
  isSemiFinal: boolean;
  isFinal: boolean;
  isTitleDecider: boolean;
  isExClub: boolean;
  isNationalTeam: boolean;
  isWorldCup: boolean;
  hasPotentialRecord: boolean;
}

export interface MatchContextDetails {
  isImportant: boolean;
  triggers: MatchTriggers;
  stadiumName: string;
  narrativeContext: string;
  objectives: MatchObjectives[];
  potentialRecords: string[];
  recentForm: ('V' | 'E' | 'D')[];
  importanceLabel: 'BAIXA' | 'MÉDIA' | 'ALTA' | 'CLÁSSICO' | 'FINAL';
  weatherCondition: string;
  pitchCondition: string;
  estimatedAttendance: string;
}

const KNOCKOUT_KEYWORDS = ['oitavas', 'quartas', 'mata-mata', 'eliminatória', 'knockout', 'cup', 'copa', 'troféu'];
const DERBY_KEYWORDS = ['clássico', 'derby', 'rival', 'rivalidade', 'fla-flu', 'gre-nal', 'derby paulista', 'superclásico'];

export function detectMatchContext(state: GameState): MatchContextDetails {
  const { career, player } = state;
  const nextMatch = career.nextMatch;

  const defaultResult: MatchContextDetails = {
    isImportant: false,
    triggers: {
      isDebut: false,
      isDerby: false,
      isKnockout: false,
      isSemiFinal: false,
      isFinal: false,
      isTitleDecider: false,
      isExClub: false,
      isNationalTeam: false,
      isWorldCup: false,
      hasPotentialRecord: false,
    },
    stadiumName: 'Estádio Municipal',
    narrativeContext: 'Partida regular de campeonato.',
    objectives: [],
    potentialRecords: [],
    recentForm: ['V', 'V', 'E', 'D', 'V'],
    importanceLabel: 'MÉDIA',
    weatherCondition: 'Ensolarado, 22°C',
    pitchCondition: 'Gramado Perfeito',
    estimatedAttendance: '35.000 torcedores',
  };

  if (!nextMatch) {
    return defaultResult;
  }

  const compLower = (nextMatch.competition || '').toLowerCase();
  const opponentLower = (nextMatch.opponent || '').toLowerCase();
  const currentClubName = career.currentClub?.name || 'Seu Clube';

  // 1. Triggers Detection
  const isDebut = career.matches.length === 0 || career.currentSeasonStats.matchesPlayed === 0;
  const isDerby = DERBY_KEYWORDS.some(k => compLower.includes(k) || opponentLower.includes(k));
  const isKnockout = KNOCKOUT_KEYWORDS.some(k => compLower.includes(k));
  const isSemiFinal = compLower.includes('semi') || compLower.includes('semifinal');
  const isFinal = compLower.includes('final') || compLower.includes('decisão');
  const isTitleDecider = isFinal || (career.week >= 34 && compLower.includes('liga'));

  // Ex-club check
  const previousClubs = (career.history || []).map(h => h.clubName.toLowerCase());
  const isExClub = previousClubs.some(cName => cName.length > 2 && opponentLower.includes(cName));

  // National team / World Cup
  const isNationalTeam = compLower.includes('seleção') || compLower.includes('eliminatórias') || compLower.includes('internacional');
  const isWorldCup = compLower.includes('copa do mundo') || compLower.includes('world cup');

  // Potential records
  const seasonGoals = career.currentSeasonStats.goals || 0;
  const totalMatches = career.matches.length || 0;
  const hasPotentialRecord = seasonGoals >= 25 || totalMatches === 99 || totalMatches === 199 || totalMatches === 499;

  const triggers: MatchTriggers = {
    isDebut,
    isDerby,
    isKnockout,
    isSemiFinal,
    isFinal,
    isTitleDecider,
    isExClub,
    isNationalTeam,
    isWorldCup,
    hasPotentialRecord,
  };

  // Important match if ANY trigger is active
  const isImportant = Object.values(triggers).some(Boolean);

  // 2. Stadium Name Generation
  let stadiumName = '';
  if (isWorldCup) {
    stadiumName = 'Estádio Lusail Icon / Maracanã Monumental';
  } else if (isNationalTeam) {
    stadiumName = 'Estádio Nacional Mané Garrincha';
  } else if (nextMatch.isHome) {
    stadiumName = `Estádio Municipal ${currentClubName}`;
  } else {
    stadiumName = `Arena ${nextMatch.opponent}`;
  }

  // Known Stadium Overrides
  if (currentClubName.includes('Real Madrid')) stadiumName = 'Estádio Santiago Bernabéu';
  if (currentClubName.includes('Barcelona')) stadiumName = 'Spotify Camp Nou';
  if (currentClubName.includes('Flamengo') || currentClubName.includes('Fluminense')) stadiumName = 'Estádio do Maracanã';
  if (currentClubName.includes('Palmeiras')) stadiumName = 'Allianz Parque';
  if (currentClubName.includes('Corinthians')) stadiumName = 'Neo Química Arena';
  if (currentClubName.includes('Manchester City')) stadiumName = 'Etihad Stadium';
  if (currentClubName.includes('Liverpool')) stadiumName = 'Anfield Road';

  // 3. Narrative Context
  let narrativeContext = 'Partida importante pelo campeonato nacional.';
  if (isDebut) narrativeContext = `A grande estreia de ${player.name} vestindo a camisa do ${currentClubName}! Olhos do mundo focados na atuação inicial.`;
  else if (isWorldCup) narrativeContext = `Confronto de peso na Copa do Mundo. Representando a nação no maior palco do futebol.`;
  else if (isFinal) narrativeContext = `A GRANDE FINAL! O troféu está em jogo no ${stadiumName}. Uma vitória imortalizará a equipe.`;
  else if (isSemiFinal) narrativeContext = `Semifinal decisiva! Apenas um passo separa o ${currentClubName} da grande decisão.`;
  else if (isDerby) narrativeContext = `CLÁSSICO DA RIVALIDADE! Enfrentando o arquirrival ${nextMatch.opponent}. Honra e orgulho em jogo.`;
  else if (isExClub) narrativeContext = `Reencontro com o ex-clube! ${player.name} enfrenta a torcida e os velhos companheiros do ${nextMatch.opponent}.`;
  else if (hasPotentialRecord) narrativeContext = `Noite de recorde! ${player.name} está a um passo de alcançar uma marca histórica na carreira.`;
  else if (isKnockout) narrativeContext = `Fase de mata-mata eliminatória. Cada erro pode custar a eliminação.`;

  // 4. Objectives Generation
  const pos = (player.position || 'CM') as Position;
  const isAttack = ['ST', 'LW', 'RW', 'CAM'].includes(pos);
  const isMid = ['CM', 'CDM'].includes(pos);

  const objectives: MatchObjectives[] = [
    {
      id: 'obj_1',
      title: isFinal ? 'Nota Superior a 8.0' : 'Nota Superior a 7.5',
      description: 'Atuação de gala avaliada positivamente pela imprensa esportiva.',
      targetRating: isFinal ? 8.0 : 7.5,
      type: 'RATING',
      rewardFame: 150,
      rewardMorale: 10,
    },
    {
      id: 'obj_2',
      title: isAttack ? 'Participação Direta em Gol' : isMid ? 'Distribuição e Criatividade' : 'Solidez Defensiva',
      description: isAttack ? 'Marcar ao menos 1 Gol ou dar Assistência decisiva.' : isMid ? 'Completar 80%+ de precisão nos passes.' : 'Evitar gols adversários no setor.',
      targetRating: 7.0,
      type: isAttack ? 'GOALS_ASSISTS' : isMid ? 'PASSES' : 'DEFENCE',
      rewardFame: 200,
      rewardMorale: 15,
    },
    {
      id: 'obj_3',
      title: 'Garantir o Resultado Positivo',
      description: `Liderar o ${currentClubName} rumo à vitória no ${stadiumName}.`,
      targetRating: 7.0,
      type: 'TEAM_WIN',
      rewardFame: 100,
      rewardMorale: 10,
    },
  ];

  // 5. Records list
  const potentialRecords: string[] = [];
  if (hasPotentialRecord) {
    if (seasonGoals >= 20) potentialRecords.push(`Pode bater o recorde de gols na temporada (${seasonGoals + 1}º gol)`);
    if (totalMatches >= 99) potentialRecords.push(`Próximo de completar ${totalMatches + 1} partidas profissionais`);
  }
  if (isFinal) potentialRecords.push('Pode conquistar o 1º título de expressão da temporada');
  if (isDebut) potentialRecords.push('Pode marcar o 1º gol oficial na estreia pelo clube');

  // 6. Importance Label
  let importanceLabel: MatchContextDetails['importanceLabel'] = 'MÉDIA';
  if (isFinal) importanceLabel = 'FINAL';
  else if (isDerby) importanceLabel = 'CLÁSSICO';
  else if (isImportant) importanceLabel = 'ALTA';

  // 7. Recent Form Generation (V/E/D)
  const matches = career.matches || [];
  const recentForm: ('V' | 'E' | 'D')[] = matches.length >= 5
    ? matches.slice(0, 5).map(m => (m.rating >= 7.5 ? 'V' : m.rating >= 6.0 ? 'E' : 'D'))
    : ['V', 'V', 'E', 'D', 'V'];

  return {
    isImportant,
    triggers,
    stadiumName,
    narrativeContext,
    objectives,
    potentialRecords,
    recentForm,
    importanceLabel,
    weatherCondition: isWorldCup ? 'Noite Agradável, 20°C' : 'Céu Aberto, 24°C',
    pitchCondition: 'Gramado Irrigado e Rápido',
    estimatedAttendance: isFinal ? '82.000 Torcedores (Lotação Máxima)' : '48.500 Torcedores',
  };
}
