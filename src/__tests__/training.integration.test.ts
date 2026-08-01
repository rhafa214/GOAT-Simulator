import { describe, it, expect, beforeEach } from 'vitest';
import { advanceWeekLogic } from '../core/state/reducers/advanceWeek';
import { GameState } from '../types';
import { createInitialGameState } from '../core/state/initialState';
import { PlayerProgressionEngine } from '../core/domain/progressionEngine';

describe('Training Integration in advanceWeek', () => {
  let state: GameState;

  beforeEach(() => {
    state = createInitialGameState();
    state.career.currentClub = {
      id: 'test_club',
      name: 'Test Club',
      tier: 1,
      reputation: 80,
      baseSalary: 10000,
      league: 'TEST_LEAGUE',
      primaryColor: '#000000'
    };
    state.player.technical = {
      PAC: 70, SHO: 70, PAS: 70, DRI: 70, DEF: 70, PHY: 70, HEA: 70,
      VIS: 70, WF: 3, SM: 3, CON: 70, ACC: 70, STA: 70, JUM: 70, FK: 70, PEN: 70, CRE: 70
    };
    state.player.rpg.fitness = 100;
    state.player.rpg.morale = 50;
    state.player.relationships.squad = 50;
    
    // Explicitly add next match null to test training without a match
    state.career.nextMatch = null;
  });

  it('applies CHEMISTRY training correctly (boosts relationships)', () => {
    state.player.trainingPlan = { focus: 'CHEMISTRY', intensity: 'MEDIUM' };
    
    const nextState = advanceWeekLogic(state);
    
    expect(nextState.player.relationships.squad).toBeGreaterThan(50);
    expect(nextState.player.rpg.morale).toBeGreaterThan(50);
    // Fitness starts 100, +15 (capped 100), -20 (Medium) = 80
    expect(nextState.player.rpg.fitness).toBe(80);
  });

  it('applies FINISHING training correctly (boosts SHO)', () => {
    state.player.trainingPlan = { focus: 'FINISHING', intensity: 'HIGH' };
    
    const nextState = advanceWeekLogic(state);
    
    // Fitness starts 100, +15 (capped 100), -35 (High) = 65
    expect(nextState.player.rpg.fitness).toBe(65);
    
    const devPoints = nextState.player.progression?.developmentPoints;
    expect(devPoints).toBeDefined();
    // SHO should have more XP than DEF
    expect(devPoints!.SHO || 0).toBeGreaterThan(devPoints!.DEF || 0);
  });

  it('applies REST training correctly (heals fitness)', () => {
    state.player.rpg.fitness = 50;
    state.player.trainingPlan = { focus: 'REST', intensity: 'MEDIUM' }; // intensity is ignored
    
    const nextState = advanceWeekLogic(state);
    
    // Fitness starts 50, +15 (weekly) = 65, +30 (Rest) = 95
    expect(nextState.player.rpg.fitness).toBe(95);
  });
});
