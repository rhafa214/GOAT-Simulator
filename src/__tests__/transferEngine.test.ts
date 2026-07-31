import { describe, it, expect, beforeEach } from 'vitest';
import { TransferEngine } from '../core/domain/transferEngine';
import { createInitialGameState } from '../core/state/initialState';
import { ALL_CLUBS } from '../data/database';
import { GameState } from '../types';

describe('TransferEngine', () => {
  let engine: TransferEngine;
  let state: GameState;

  beforeEach(() => {
    engine = new TransferEngine(0.12345); // deterministic seed
    state = createInitialGameState();
    state.career.currentClub = ALL_CLUBS[0]; // Set an initial club
    state.player.technical = {
      PAC: 80, SHO: 80, PAS: 80, DRI: 80, DEF: 80, PHY: 80,
      HEA: 80, VIS: 80, WF: 80, SM: 80, CON: 80, ACC: 80,
      STA: 80, JUM: 80, FK: 80, PEN: 80, CRE: 80
    };
    state.player.age = 22;
    state.career.year = 2024;
    state.career.week = 26; // Summer window
    state.career.contract = {
      salary: 10000,
      duration: 3,
      bonuses: 0,
      marketValue: 1000000,
      expirationYear: 2027
    };
    state.career.transferState = {
      isTransferRequested: false,
      isListed: false,
      activeProposals: []
    };
  });

  it('calculates overall correctly', () => {
    const overall = engine.calculateOverall(state);
    expect(overall).toBe(80);
  });

  it('calculates potential correctly', () => {
    const potential = engine.calculatePotential(80, 22);
    expect(potential).toBe(92); // 80 + (28-22)*2
  });

  it('calculates market value correctly', () => {
    const value = engine.calculateMarketValue(state);
    expect(value).toBeGreaterThan(0);
  });

  it('detects transfer windows correctly', () => {
    expect(engine.isTransferWindow(26)).toBe(true);
    expect(engine.isTransferWindow(10)).toBe(false);
    expect(engine.isTransferWindow(51)).toBe(true);
  });

  it('generates interest in transfer window', () => {
    state.career.week = 26;
    const proposals = engine.generateInterest(state);
    // Might be 0 to 2 based on RNG, but with seed 0.12345 it should generate something.
    // If rng doesn't hit, let's just assert it returns an array
    expect(Array.isArray(proposals)).toBe(true);
    
    // To guarantee proposals, let's list the player
    state.career.transferState!.isListed = true;
    const proposalsListed = engine.generateInterest(state);
    expect(proposalsListed.length).toBeGreaterThan(0);
    expect(proposalsListed[0].status).toBe('generated');
    expect(proposalsListed[0].clubId).not.toBe(state.career.currentClub!.id);
  });

  
  it('creates manual proposal for specific club', () => {
    const proposal = engine.createProposal(state, ALL_CLUBS[1].id);
    expect(proposal).not.toBeNull();
    expect(proposal?.clubId).toBe(ALL_CLUBS[1].id);
    expect(proposal?.status).toBe('generated');
  });

  it('negotiates proposal successfully', () => {
    const proposal = {
      id: 'p1',
      clubId: 'c1',
      clubName: 'Test Club',
      offerSalary: 10000,
      offerDuration: 2,
      transferFee: 1000000,
      status: 'generated' as const,
      weekGenerated: 26,
      yearGenerated: 2024
    };

    // Agent with 100 skill should succeed
    const negotiated = engine.negotiateProposal(proposal, 'demand_more_salary', 100);
    expect(negotiated.status).toBe('negotiating');
    expect(negotiated.offerSalary).toBeGreaterThan(10000);
  });

  it('accepts proposal and updates state', () => {
    const targetClub = ALL_CLUBS[1];
    const proposal = {
      id: 'p1',
      clubId: targetClub.id,
      clubName: targetClub.name,
      offerSalary: 50000,
      offerDuration: 4,
      transferFee: 5000000,
      status: 'generated' as const,
      weekGenerated: 26,
      yearGenerated: 2024
    };

    state.career.transferState!.activeProposals.push(proposal);
    const newState = engine.acceptProposal(state, 'p1');
    
    expect(newState.career.currentClub?.id).toBe(targetClub.id);
    expect(newState.career.contract?.salary).toBe(50000);
    expect(newState.career.contract?.duration).toBe(4);
    expect(newState.finances.weeklyWage).toBe(50000);
    expect(newState.career.transfers.length).toBe(1);
    expect(newState.career.transferState?.activeProposals.length).toBe(0);
  });

  it('rejects proposal and updates status', () => {
    const proposal = {
      id: 'p1',
      clubId: 'c1',
      clubName: 'Test Club',
      offerSalary: 50000,
      offerDuration: 4,
      transferFee: 5000000,
      status: 'generated' as const,
      weekGenerated: 26,
      yearGenerated: 2024
    };

    state.career.transferState!.activeProposals.push(proposal);
    const newState = engine.rejectProposal(state, 'p1');
    
    expect(newState.career.transferState?.activeProposals[0].status).toBe('rejected');
  });

  it('cleans up expired proposals', () => {
    const proposal = {
      id: 'p1',
      clubId: 'c1',
      clubName: 'Test Club',
      offerSalary: 50000,
      offerDuration: 4,
      transferFee: 5000000,
      status: 'generated' as const,
      weekGenerated: 20, // 6 weeks ago
      yearGenerated: 2024
    };

    state.career.transferState!.activeProposals.push(proposal);
    const newState = engine.cleanupProposals(state);
    
    expect(newState.career.transferState?.activeProposals.length).toBe(0);
  });
});
