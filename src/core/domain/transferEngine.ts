import { GameState, TransferProposal, Club, ProposalStatus, PlayerContract } from '../../types';
import { SeededRNG } from '../../utils/rng';
import { ALL_CLUBS } from '../../data/database';

export class TransferEngine {
  private rng: SeededRNG;

  constructor(seed?: number) {
    this.rng = new SeededRNG(seed || Math.random());
  }

  /**
   * Calculates a player's overall rating.
   */
  public calculateOverall(state: GameState): number {
    const technical = state.player.technical || {};
    const values = Object.values(technical) as number[];
    if (values.length === 0) return 70;
    return Math.floor(values.reduce((a, b) => a + b, 0) / values.length);
  }

  /**
   * Estimates a player's potential based on age and overall.
   */
  public calculatePotential(overall: number, age: number): number {
    if (age >= 28) return overall;
    const growthYears = 28 - age;
    return Math.min(99, overall + growthYears * 2);
  }

  /**
   * Calculates the market value of the player.
   */
  public calculateMarketValue(state: GameState): number {
    const overall = this.calculateOverall(state);
    const age = state.player.age;
    const potential = this.calculatePotential(overall, age);
    const fame = state.player.rpg.fame || 0;
    
    // Base value based on overall (exponential curve)
    let baseValue = Math.pow(overall / 10, 4) * 10000;
    
    // Age multiplier (peak value around 24-27)
    let ageMultiplier = 1;
    if (age < 21) ageMultiplier = 1.5;
    else if (age < 24) ageMultiplier = 1.3;
    else if (age < 28) ageMultiplier = 1.0;
    else if (age < 32) ageMultiplier = 0.6;
    else ageMultiplier = 0.3;
    
    // Potential premium
    const potentialPremium = 1 + ((potential - overall) * 0.05);
    
    // Fame multiplier
    const fameMultiplier = 1 + (fame / 100);
    
    // Performance multiplier (from current season stats)
    let performanceMultiplier = 1;
    if (state.career.currentSeasonStats) {
      const avgRating = state.career.currentSeasonStats.avgRating || 6.0;
      if (avgRating > 8.0) performanceMultiplier = 1.4;
      else if (avgRating > 7.0) performanceMultiplier = 1.2;
      else if (avgRating < 5.0) performanceMultiplier = 0.8;
    }
    
    // Contract duration remaining multiplier
    let contractMultiplier = 1;
    if (state.career.contract) {
      const yearsLeft = state.career.contract.expirationYear - state.career.year;
      if (yearsLeft <= 0) contractMultiplier = 0.1; // Almost free agent
      else if (yearsLeft === 1) contractMultiplier = 0.7;
      else if (yearsLeft >= 3) contractMultiplier = 1.2;
    }

    
    // Personality multiplier
    let personalityMultiplier = 1;
    if (state.player.personality === 'PROFESSIONAL' || state.player.personality === 'LEADER') {
      personalityMultiplier = 1.1;
    } else if (state.player.personality === 'TEMPERAMENTAL' || state.player.personality === 'MERCENARY') {
      personalityMultiplier = 0.9;
    }

    return Math.round(baseValue * ageMultiplier * potentialPremium * fameMultiplier * performanceMultiplier * contractMultiplier * personalityMultiplier);
  }


  /**
   * Evaluates if we are in a transfer window.
   * Assuming summer window (weeks 24-32) and winter window (weeks 50-52, 1-4).
   */
  public isTransferWindow(week: number): boolean {
    return (week >= 24 && week <= 32) || (week >= 50 || week <= 4);
  }

  /**
   * Generates interest from other clubs based on player profile.
   */
  
  /**
   * Creates a manual proposal from a specific club.
   */
  public createProposal(state: GameState, clubId: string): TransferProposal | null {
    const club = ALL_CLUBS.find(c => c.id === clubId);
    if (!club) return null;

    const overall = this.calculateOverall(state);
    const fame = state.player.rpg.fame || 0;
    const marketValue = this.calculateMarketValue(state);

    const isRichClub = club.tier === 1;
    const baseSalary = isRichClub ? 50000 : 5000 * (6 - club.tier);
    
    const offerSalary = Math.round(baseSalary * (overall / 70) * (1 + fame / 200));
    const offerDuration = Math.floor(this.rng.random() * 4) + 1; 
    
    const transferFee = Math.round(marketValue * (0.8 + (this.rng.random() * 0.4)));

    const expectedRole = overall > 85 ? 'Craque do Time' : overall > 75 ? 'Titular Absoluto' : overall > 65 ? 'Titular' : 'Reserva';

    return {
      expectedRole,
      negotiationRounds: 0,
      id: `prop_${Date.now()}_${club.id}_${Math.floor(this.rng.random() * 1000)}`,
      clubId: club.id,
      clubName: club.name,
      offerSalary,
      offerDuration,
      transferFee,
      status: 'generated',
      weekGenerated: state.career.week,
      yearGenerated: state.career.year,
    };
  }

  public generateInterest(state: GameState): TransferProposal[] {
    if (!this.isTransferWindow(state.career.week)) {
      return [];
    }

    const overall = this.calculateOverall(state);
    const fame = state.player.rpg.fame || 0;
    const marketValue = this.calculateMarketValue(state);
    
    // Determine the tier of clubs that would be interested
    let targetTier = 5;
    if (overall > 85) targetTier = 1;
    else if (overall > 75) targetTier = 2;
    else if (overall > 65) targetTier = 3;
    else if (overall > 55) targetTier = 4;

    const interestedClubs = ALL_CLUBS.filter(c => {
      // Don't generate interest from current club
      if (state.career.currentClub && c.id === state.career.currentClub.id) return false;
      
      // Filter by tier (allow 1 tier higher if high potential/fame)
      if (c.tier < targetTier - 1) return false;
      
      return true;
    });

    // Shuffle and pick top 1-3 clubs
    const shuffled = interestedClubs.sort(() => this.rng.random() - 0.5);
    const numInterested = Math.floor(this.rng.random() * 3) + (state.career.transferState?.isListed ? 1 : 0);
    const selectedClubs = shuffled.slice(0, Math.min(numInterested, shuffled.length));

    const proposals: TransferProposal[] = [];
    
    selectedClubs.forEach(club => {
      // Create a proposal

      // Club need multiplier (randomized for now, simulating internal club state)
      const clubNeed = 0.8 + (this.rng.random() * 0.4); // 0.8 to 1.2
      const isRichClub = club.tier === 1;
      const baseSalary = isRichClub ? 50000 : 5000 * (6 - club.tier);
      
      // Salary scales with overall, fame, and club need
      let offerSalary = Math.round(baseSalary * (overall / 70) * (1 + fame / 200) * clubNeed);
      
      // Mercenary personality asks for more, Loyal might accept less? Handled in negotiation usually.

      const offerDuration = Math.floor(this.rng.random() * 4) + 1; // 1 to 4 years
      
      // Transfer fee offered to current club
      const transferFee = Math.round(marketValue * (0.8 + (this.rng.random() * 0.4)));

      const expectedRole = overall > 85 ? 'Craque do Time' : overall > 75 ? 'Titular Absoluto' : overall > 65 ? 'Titular' : 'Reserva';

      proposals.push({
        expectedRole,
        negotiationRounds: 0,
        id: `prop_${Date.now()}_${club.id}_${Math.floor(this.rng.random() * 1000)}`,
        clubId: club.id,
        clubName: club.name,
        offerSalary,
        offerDuration,
        transferFee,
        status: 'generated',
        weekGenerated: state.career.week,
        yearGenerated: state.career.year,
      });
    });

    return proposals;
  }

  /**
   * Simulates agent negotiation to demand better terms.
   */
  public negotiateProposal(proposal: TransferProposal, action: 'demand_more_salary' | 'demand_shorter_duration' | 'demand_longer_duration', agentSkill: number): TransferProposal {
    const updated = { ...proposal };
    updated.status = 'negotiating';
    updated.negotiationRounds = (updated.negotiationRounds || 0) + 1;
    if (updated.negotiationRounds >= 3) {
      updated.status = 'withdrawn';
      return updated;
    }
    
    const successChance = agentSkill / 100; // 0.0 to 1.0
    const isSuccess = this.rng.random() < successChance;

    if (isSuccess) {
      if (action === 'demand_more_salary') {
        updated.offerSalary = Math.round(updated.offerSalary * (1.1 + (this.rng.random() * 0.2)));
      } else if (action === 'demand_shorter_duration') {
        updated.offerDuration = Math.max(1, updated.offerDuration - 1);
      } else if (action === 'demand_longer_duration') {
        updated.offerDuration += 1;
      }
    } else {
      // If fails, club might reject or keep same
      const clubWalksAway = this.rng.random() > 0.6; // 40% chance club walks away if negotiation fails
      if (clubWalksAway) {
        updated.status = 'withdrawn';
      }
    }

    return updated;
  }

  /**
   * Processes accepting a proposal.
   */
  public acceptProposal(state: GameState, proposalId: string): GameState {
    const proposal = state.career.transferState?.activeProposals.find(p => p.id === proposalId);
    if (!proposal) return state;

    const club = ALL_CLUBS.find(c => c.id === proposal.clubId);
    if (!club) return state;

    const newState = { ...state };
    
    // Register transfer record
    if (newState.career.currentClub) {
      newState.career.transfers.push({
        year: newState.career.year,
        week: newState.career.week,
        fromClub: newState.career.currentClub.name,
        toClub: club.name,
        fee: proposal.transferFee,
        salary: proposal.offerSalary
      });
    }

    // Update club and contract
    newState.career.currentClub = club;
    newState.career.contract = {
      salary: proposal.offerSalary,
      duration: proposal.offerDuration,
      bonuses: 0,
      marketValue: this.calculateMarketValue(state), // update market value
      expirationYear: newState.career.year + proposal.offerDuration
    };

    // Update finances
    newState.finances.weeklyWage = proposal.offerSalary;

    // Reset transfer state
    if (newState.career.transferState) {
      newState.career.transferState.activeProposals = [];
      newState.career.transferState.isTransferRequested = false;
      newState.career.transferState.isListed = false;
    }

    return newState;
  }

  /**
   * Processes rejecting a proposal.
   */
  public rejectProposal(state: GameState, proposalId: string): GameState {
    const newState = { ...state };
    if (newState.career.transferState) {
      const index = newState.career.transferState.activeProposals.findIndex(p => p.id === proposalId);
      if (index !== -1) {
        newState.career.transferState.activeProposals[index].status = 'rejected';
      }
    }
    return newState;
  }

  /**
   * Clean up expired or withdrawn proposals.
   */
  public cleanupProposals(state: GameState): GameState {
    if (!state.career.transferState) return state;
    
    const newState = { ...state };
    if (newState.career.transferState) {
      const now = newState.career.year * 52 + newState.career.week;
      newState.career.transferState.activeProposals = newState.career.transferState.activeProposals.filter(p => {
        const propTime = p.yearGenerated * 52 + p.weekGenerated;
        const ageInWeeks = now - propTime;
        // Expire after 4 weeks
        if (ageInWeeks > 4 && (p.status === 'generated' || p.status === 'presented' || p.status === 'negotiating')) {
          p.status = 'expired';
          return false;
        }
        return p.status !== 'rejected' && p.status !== 'withdrawn' && p.status !== 'expired';
      });
    }
    return newState;
  }
}
