import { GameState, GameEvent } from '../../types';
import { GAME_EVENTS } from '../../data/events';
import { IRNG } from '../../utils/rng';

export interface EventEngineConfig {
  baseProbabilities: {
    small: number;
    medium: number;
    large: number;
    historic: number;
  };
}

const DEFAULT_CONFIG: EventEngineConfig = {
  baseProbabilities: {
    small: 0.15,
    medium: 0.05,
    large: 0.01,
    historic: 0.005
  }
};

export class EventEngine {
  private config: EventEngineConfig;

  constructor(config: EventEngineConfig = DEFAULT_CONFIG) {
    this.config = config;
  }

  /**
   * Determine which events (if any) should fire this week.
   * Modifies the rng state indirectly.
   * Returns an array of events (though usually 1 or 0)
   */
  public evaluateEvents(state: GameState, rng: IRNG): GameEvent[] {
    const eligibleEvents = GAME_EVENTS.filter(e => this.isEligible(e, state));
    
    if (eligibleEvents.length === 0) {
      return [];
    }

    // Sort by priority first
    eligibleEvents.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    const selectedEvents: GameEvent[] = [];

    // Separate events by rarity to roll against global probabilities
    const byRarity = {
      historic: eligibleEvents.filter(e => e.rarity === 'historic'),
      large: eligibleEvents.filter(e => e.rarity === 'large'),
      medium: eligibleEvents.filter(e => e.rarity === 'medium'),
      small: eligibleEvents.filter(e => (!e.rarity || e.rarity === 'small'))
    };

    // Roll for historic first, if hits, we might skip others or not. We'll allow 1 event max per week for now
    if (this.tryTriggerCategory(byRarity.historic, this.config.baseProbabilities.historic, rng, selectedEvents)) return selectedEvents;
    if (this.tryTriggerCategory(byRarity.large, this.config.baseProbabilities.large, rng, selectedEvents)) return selectedEvents;
    if (this.tryTriggerCategory(byRarity.medium, this.config.baseProbabilities.medium, rng, selectedEvents)) return selectedEvents;
    if (this.tryTriggerCategory(byRarity.small, this.config.baseProbabilities.small, rng, selectedEvents)) return selectedEvents;

    return selectedEvents;
  }

  private isEligible(event: GameEvent, state: GameState): boolean {
    // Check cooldown
    if (event.cooldown && state.narrative.eventHistory) {
      const lastOccurred = state.narrative.eventHistory[event.id];
      if (lastOccurred !== undefined) {
        // Calculate total weeks elapsed
        // Simplification: just using absolute week number isn't robust across seasons.
        // A better absolute time is (year * 52) + week.
        const currentAbsWeek = (state.career.year * 52) + state.career.week;
        if (currentAbsWeek - lastOccurred < event.cooldown) {
          return false;
        }
      }
    }

    // Check condition
    try {
      if (!event.condition(state)) {
        return false;
      }
    } catch (e) {
      // If condition fails to evaluate, it's not eligible
      return false;
    }

    // Check event weight logic
    // Weight = 0 means it can only be triggered explicitly, not by RNG loop
    if (event.weight <= 0) {
      return false;
    }

    return true;
  }

  private tryTriggerCategory(events: GameEvent[], categoryProb: number, rng: IRNG, out: GameEvent[]): boolean {
    if (events.length === 0) return false;

    // Roll to see if THIS category fires
    const roll = rng.random();
    if (roll > categoryProb) {
      return false;
    }

    // If it fires, pick one based on weighted probability
    const totalWeight = events.reduce((sum, e) => sum + e.weight, 0);
    if (totalWeight <= 0) return false;

    let pick = rng.random() * totalWeight;
    for (const e of events) {
      pick -= e.weight;
      if (pick <= 0) {
        out.push(e);
        return true;
      }
    }
    
    // Fallback
    out.push(events[events.length - 1]);
    return true;
  }
}

export const eventEngine = new EventEngine();
