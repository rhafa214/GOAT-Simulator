import { GameEvent, GameState } from '../types';

export const GAME_EVENTS: GameEvent[] = [
  {
    id: 'EVT_COACH_FIRED',
    title: 'Treinador Demitido!',
    description: 'A sequência de resultados ruins não perdoou. A diretoria anunciou a demissão do treinador. Como você reage no vestiário?',
    imageType: 'press',
    condition: (state: GameState) => state.career.currentClub !== null && state.narrative.flags['coach_fired'] !== state.career.season,
    weight: 20,
    rarity: 'large',
    isUrgent: false,
    options: [
      {
        id: 'OPT_SUPPORT',
        label: 'Agradecer publicamente',
        description: 'Posta uma mensagem de apoio ao ex-treinador.',
        effect: { relationshipModifiers: { press: 10, fans: 5 }, customFlag: { key: 'coach_fired', value: state => state.career.season } }
      },
      {
        id: 'OPT_SILENCE',
        label: 'Manter silêncio',
        description: 'Foca apenas no próximo jogo.',
        effect: { moraleModifier: -5, customFlag: { key: 'coach_fired', value: state => state.career.season } }
      },
      {
        id: 'OPT_CELEBRATE',
        label: 'Celebrar com os "parças"',
        description: 'Você não gostava dele mesmo. Vazou que você comemorou.',
        effect: { relationshipModifiers: { manager: -20, press: -10, squad: -10 }, customFlag: { key: 'coach_fired', value: state => state.career.season } }
      }
    ]
  },
  {
    id: 'EVT_INJURY_MINOR',
    title: 'Desconforto Muscular',
    description: 'Durante o treino, você sentiu uma fisgada na coxa.',
    imageType: 'injury',
    condition: (state: GameState) => state.player.rpg.fitness < 70,
    weight: 40,
    rarity: 'medium',
    isUrgent: true,
    options: [
      {
        id: 'OPT_REST',
        label: 'Pedir para sair',
        description: 'Perde o próximo jogo, mas evita lesão pior.',
        effect: { fitnessModifier: 20, moraleModifier: -10, customFlag: { key: 'missed_match', value: true } }
      },
      {
        id: 'OPT_PLAY_THROUGH',
        label: 'Esconder do DM',
        description: 'Tenta jogar no sacrifício.',
        effect: { fitnessModifier: -30, relationshipModifiers: { manager: 10 }, triggerNextEvent: 'EVT_INJURY_MAJOR' }
      }
    ]
  },
  {
    id: 'EVT_INJURY_MAJOR',
    title: 'Lesão Grave Confirmada',
    description: 'Os exames apontaram uma ruptura. Você ficará fora por semanas.',
    imageType: 'injury',
    condition: (state: GameState) => false, // Only triggered by other events
    weight: 0,
    rarity: 'historic',
    isUrgent: true,
    options: [
      {
        id: 'OPT_ACCEPT',
        label: 'Focar na recuperação',
        effect: { fitnessModifier: 10, moraleModifier: -30, technicalModifiers: { PAC: -2, PHY: -1 } }
      }
    ]
  },
  {
    id: 'EVT_SPONSOR_OFFER',
    title: 'Oferta de Patrocínio: Marca de Chuteiras',
    description: 'Uma grande marca quer ser sua patrocinadora oficial.',
    imageType: 'press',
    condition: (state: GameState) => state.player.rpg.fame > 30 && !state.finances.sponsors.includes('Chuteira Premium'),
    weight: 30,
    rarity: 'medium',
    isUrgent: false,
    options: [
      {
        id: 'OPT_ACCEPT_MONEY',
        label: 'Aceitar (Contrato Lucrativo)',
        description: 'Bônus alto, mas exige muitos compromissos.',
        effect: { financeModifier: 50000, fitnessModifier: -5, fameModifier: 10, customFlag: { key: 'new_sponsor', value: 'Chuteira Premium' } }
      },
      {
        id: 'OPT_REJECT',
        label: 'Recusar',
        description: 'Foco apenas no futebol.',
        effect: { moraleModifier: 5, fitnessModifier: 5 }
      }
    ]
  },
  {
    id: 'EVT_SCANDAL_NIGHTCLUB',
    title: 'Flagrado na Balada!',
    description: 'Fotos suas em uma boate às 4 da manhã na véspera de jogo vazaram na internet.',
    imageType: 'party',
    condition: (state: GameState) => state.player.personality === 'PARTY_ANIMAL' || state.player.rpg.fame > 50,
    weight: 15,
    rarity: 'large',
    isUrgent: true,
    options: [
      {
        id: 'OPT_APOLOGIZE',
        label: 'Pedir desculpas públicas',
        description: 'Assume o erro.',
        effect: { relationshipModifiers: { press: -10, fans: -15, manager: -20 }, fameModifier: -5, moraleModifier: -10 }
      },
      {
        id: 'OPT_DENY',
        label: 'Dizer que é montagem',
        description: 'Risco alto, mas pode colar.',
        effect: { relationshipModifiers: { press: -30 }, fameModifier: 10 }
      },
      {
        id: 'OPT_OWN_IT',
        label: '"Eu estava de folga!"',
        description: 'Bate de frente com as críticas.',
        effect: { relationshipModifiers: { fans: 10, manager: -30 }, fameModifier: 20 }
      }
    ]
  },
  {
    id: 'EVT_MARRIAGE',
    title: 'O Casamento do Ano',
    description: 'Chegou o momento de juntar as escovas de dente.',
    imageType: 'party',
    condition: (state: GameState) => state.player.age >= 22 && !state.narrative.flags['married'],
    weight: 5,
    rarity: 'historic',
    isUrgent: false,
    options: [
      {
        id: 'OPT_MARRY',
        label: 'Casar',
        description: 'Traz estabilidade, mas custa caro.',
        effect: { moraleModifier: 30, financeModifier: -100000, customFlag: { key: 'married', value: true } }
      },
      {
        id: 'OPT_POSTPONE',
        label: 'Focar na carreira por enquanto',
        effect: { moraleModifier: -10 }
      }
    ]
  },
  {
    id: 'EVT_DOCUMENTARY',
    title: 'Proposta de Documentário',
    description: 'A Netflix quer gravar a sua temporada atual.',
    imageType: 'press',
    condition: (state: GameState) => state.player.rpg.fame > 70 && !state.narrative.flags['documentary'],
    weight: 10,
    rarity: 'large',
    isUrgent: false,
    options: [
      {
        id: 'OPT_ACCEPT_DOC',
        label: 'Aceitar as câmeras',
        description: 'Muita fama, mas tira sua privacidade.',
        effect: { fameModifier: 40, financeModifier: 200000, relationshipModifiers: { squad: -10 }, customFlag: { key: 'documentary', value: true } }
      },
      {
        id: 'OPT_REJECT_DOC',
        label: 'Privacidade em 1º lugar',
        effect: { moraleModifier: 10, relationshipModifiers: { squad: 10 } }
      }
    ]
  },
  {
    id: 'EVT_ARABIA_OFFER',
    title: 'Mala Preta da Arábia',
    description: 'Um clube saudita oferece um salário astronômico para você deixar o clube no meio da temporada.',
    imageType: 'press',
    condition: (state: GameState) => state.player.rpg.fame > 60 && state.career.currentClub?.tier !== 1,
    weight: 10,
    rarity: 'large',
    isUrgent: true,
    options: [
      {
        id: 'OPT_ACCEPT_ARABIA',
        label: 'Aceitar os milhões',
        description: 'Ganha muito dinheiro, mas vai para uma liga menor.',
        effect: { financeModifier: 5000000, fameModifier: -10, customFlag: { key: 'transfer_arabia', value: true } }
      },
      {
        id: 'OPT_STAY',
        label: 'Recusar (Foco no Legado)',
        description: 'Você quer ser uma lenda.',
        effect: { relationshipModifiers: { fans: 30, manager: 20 }, moraleModifier: 15 }
      }
    ]
  },
  {
    id: 'EVT_FIGHT_TRAINING',
    title: 'Briga no Treino',
    description: 'Após uma entrada dura, você e o zagueiro titular trocaram empurrões.',
    imageType: 'training',
    condition: (state: GameState) => state.player.personality === 'TEMPERAMENTAL' || state.player.personality === 'ARROGANT',
    weight: 15,
    rarity: 'small',
    isUrgent: false,
    options: [
      {
        id: 'OPT_APOLOGIZE_FIGHT',
        label: 'Pedir desculpas na roda',
        effect: { relationshipModifiers: { squad: 10, manager: 10 }, moraleModifier: 5 }
      },
      {
        id: 'OPT_DOUBLE_DOWN',
        label: 'Ir pra cima dele',
        description: 'Mostra quem manda, mas racha o elenco.',
        effect: { relationshipModifiers: { squad: -20, manager: -20 }, fameModifier: 10, customFlag: { key: 'suspended', value: true } }
      }
    ]
  },
  {
    id: 'EVT_NATIONAL_TEAM',
    title: 'Convocação Histórica!',
    description: 'O treinador da seleção listou seu nome para os próximos amistosos.',
    imageType: 'press',
    condition: (state: GameState) => state.player.technical.PAC + state.player.technical.SHO > 150 && !state.narrative.flags['national_team'],
    weight: 10,
    rarity: 'historic',
    isUrgent: false,
    options: [
      {
        id: 'OPT_CELEBRATE_NT',
        label: 'Comemorar nas redes',
        effect: { fameModifier: 30, relationshipModifiers: { fans: 20 }, moraleModifier: 20, customFlag: { key: 'national_team', value: true } }
      }
    ]
  },
  {
    id: 'EVT_REAL_MADRID_INTEREST',
    title: 'Os Galácticos de Olho',
    description: 'O jornal Marca noticiou que você é o alvo #1 do Real Madrid.',
    imageType: 'press',
    condition: (state: GameState) => state.player.rpg.fame > 80 && state.career.currentClub?.name !== 'Real Madrid',
    weight: 5,
    rarity: 'historic',
    isUrgent: false,
    options: [
      {
        id: 'OPT_FLIRT',
        label: '"Seria um sonho"',
        description: 'Irrita seu clube atual.',
        effect: { relationshipModifiers: { fans: -20, manager: -10 }, fameModifier: 20 }
      },
      {
        id: 'OPT_FOCUS',
        label: '"Estou focado no meu time"',
        effect: { relationshipModifiers: { fans: 20 }, moraleModifier: 10 }
      }
    ]
  }
];
