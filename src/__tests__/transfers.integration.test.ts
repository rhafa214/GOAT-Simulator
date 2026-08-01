import { describe, it, expect, vi } from 'vitest';
import { runSimulation, SimulationRequest } from '../core/domain/simulationEngine';
import { createInitialGameState } from '../core/state/initialState';
import { ALL_CLUBS } from '../data/database';
import { GameState } from '../types';

describe('Transfers Integration', () => {
  it('stops simulation when transfer proposal is generated', () => {
    const initialState = createInitialGameState();
    initialState.player.technical = {
      PAC: 99, SHO: 99, PAS: 99, DRI: 99, DEF: 99, PHY: 99,
      HEA: 99, VIS: 99, WF: 99, SM: 99, CON: 99, ACC: 99,
      STA: 99, JUM: 99, FK: 99, PEN: 99, CRE: 99
    };
    initialState.player.age = 22;
    initialState.career.year = 2024;
    initialState.career.week = 26; // Summer window
    initialState.career.currentClub = ALL_CLUBS[0];
    initialState.career.contract = {
      salary: 10000,
      duration: 3,
      bonuses: 0,
      marketValue: 100000000,
      expirationYear: 2027
    };
    initialState.career.transferState = {
      isTransferRequested: true,
      isListed: true,
      activeProposals: []
    };

    const request: SimulationRequest = {
      mode: 'ONE_MONTH',
      maxIterations: 10
    };

    const generator = runSimulation(initialState, request);
    let current;
    while (true) {
      const next = generator.next();
      if (next.done) {
        current = next.value;
        break;
      }
    }

    const { finalState, stopReason } = current as any;

    expect(stopReason).toBe('TRANSFER_OFFER');
    expect(finalState.phase).toBe('TRANSFERS');
    expect(finalState.career.transferState.activeProposals.length).toBeGreaterThan(0);
  });
});
