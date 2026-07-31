import { describe, it, expect } from 'vitest';
import { advanceWeekLogic } from '../core/state/reducers/advanceWeek';
import { careerReducer } from '../core/state/reducers/careerReducer';
import { GameState } from '../types';
import { rng, setRNG, SeededRNG } from '../utils/rng';

describe('advanceWeek integration with Season Engine v1', () => {
  it('simulates a short season', () => {
    setRNG(new SeededRNG(42));
    
    let state: GameState = {
      phase: 'HUB',
      player: {
        name: 'Test Player',
        position: 'ST',
        age: 20,
        nationality: 'BR',
        personality: 'HUMBLE',
        avatarUrl: '',
        appearance: {} as any,
        technical: {
            PAC: 80, SHO: 80, PAS: 80, DRI: 80, DEF: 80, PHY: 80, HEA: 80, VIS: 80,
            WF: 80, SM: 80, CON: 80, ACC: 80, STA: 80, JUM: 80, FK: 80, PEN: 80, CRE: 80
        },
        rpg: { fitness: 100, morale: 100, fame: 50, fans: 50, LDR: 50, DET: 50, COM: 50 },
        relationships: { fans: 50, manager: 50, press: 50, squad: 50 }
      },
      career: {
        week: 1,
        season: 1,
        year: 2024,
        shirtNumber: 9,
        isCaptain: false,
        currentClub: null,
        nationalTeam: null,
        history: [],
        matches: [],
        transfers: [],
        awards: { ballonDor: 0, goldenBoot: 0, toty: 0, motm: 0 },
        nextMatch: null,
        currentSeasonStats: {
          year: 2024, clubId: '', clubName: '', shirtNumber: 9, salary: 0,
          matchesPlayed: 0, minutesPlayed: 0, goals: 0, assists: 0, shots: 0, passes: 0,
          passAccuracySum: 0, avgRating: 0, injuries: 0, motm: 0, captaincies: 0,
          competitions: [], trophies: [], awards: []
        }
      },
      finances: { balance: 0, weeklyWage: 10000, sponsors: [], assets: [] },
      narrative: { activeEvents: [], flags: {}, news: [], eventHistory: {} }
    };

    // 1. Setup career (create season, generate calendar)
    state.career = careerReducer(state.career, { 
      type: 'SETUP_CAREER', 
      payload: { 
        club: { id: 'of_br_corinthianssp', name: 'Corinthians SP', tier: 1, reputation: 90, baseSalary: 10000, league: 'Série A (Brasil)', primaryColor: 'white' } 
      } 
    });

    expect(state.career.currentSeason).toBeDefined();
    expect(state.career.currentSeason!.competitions.length).toBeGreaterThan(0);
    expect(state.career.nextMatch).toBeDefined();

    const initialComp = state.career.currentSeason!.competitions[0];
    const maxWeeks = Math.max(...initialComp.fixtures.map(f => f.week));

    // 2. Simulate until season end
    let weeksSimulated = 0;
    while(state.career.week <= 52 && weeksSimulated < 60) {
       // if we are at POST_MATCH or EVENT, we should ideally go back to HUB to allow advancing again
       // but advanceWeekLogic doesn't care about phase when advancing, it just processes.
       // However, advanceWeekLogic expects phase HUB, and returns POST_MATCH if match was played.
       
       if (state.phase === 'POST_MATCH' || state.phase === 'EVENT') {
           state.phase = 'HUB';
           continue; // Just change phase back to HUB in this loop, simulate user clicking continue
       }

       state = advanceWeekLogic(state);
       weeksSimulated++;
    }

    // 3. Verify season finished and new season started
    expect(state.career.year).toBe(2025);
    expect(state.career.currentSeason).toBeDefined();
    
    // Check that historical stats were saved
    expect(state.career.history.length).toBe(1);
    expect(state.career.history[0].matchesPlayed).toBeGreaterThan(0);
  });
});
