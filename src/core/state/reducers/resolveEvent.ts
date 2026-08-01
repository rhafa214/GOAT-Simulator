import { GameState, GameEvent } from '../../../types';
import { GAME_EVENTS } from '../../../data/events';
import { newsEngine } from '../../domain/newsEngine';
import { SeededRNG } from '../../../utils/rng';
// from '../../../data/events';

export function resolveEventLogic(state: GameState, payload: { eventId: string; optionId: string }): GameState {
  const eventId = state.narrative.activeEvents.find(id => id === payload.eventId);
  const event = GAME_EVENTS.find(e => e.id === eventId);
  if (!event) return state;

  const option = event.options.find(o => o.id === payload.optionId);
  if (!option) return state;

  const effect = option.effect;
  
  let newPlayer = { ...state.player };
  let newFinances = { ...state.finances };
  let newFlags = { ...state.narrative.flags };

  if (effect.moraleModifier) newPlayer.rpg.morale = Math.max(0, Math.min(100, newPlayer.rpg.morale + effect.moraleModifier));
  if (effect.fitnessModifier) newPlayer.rpg.fitness = Math.max(0, Math.min(100, newPlayer.rpg.fitness + effect.fitnessModifier));
  if (effect.fameModifier) newPlayer.rpg.fame = Math.max(0, Math.min(100, newPlayer.rpg.fame + effect.fameModifier));
  
  if (effect.financeModifier) newFinances.balance += effect.financeModifier;
  
  if (effect.relationshipModifiers) {
    newPlayer.relationships = { ...newPlayer.relationships };
    for (const [key, val] of Object.entries(effect.relationshipModifiers)) {
       newPlayer.relationships[key as keyof typeof newPlayer.relationships] = Math.max(0, Math.min(100, newPlayer.relationships[key as keyof typeof newPlayer.relationships] + (val as number)));
    }
  }

  if (effect.technicalModifiers) {
    newPlayer.technical = { ...newPlayer.technical };
    for (const [key, val] of Object.entries(effect.technicalModifiers)) {
       newPlayer.technical[key as keyof typeof newPlayer.technical] = Math.max(1, Math.min(99, newPlayer.technical[key as keyof typeof newPlayer.technical] + (val as number)));
    }
  }

  if (effect.customFlag) {
    newFlags[effect.customFlag.key] = typeof effect.customFlag.value === 'function' ? effect.customFlag.value(state) : effect.customFlag.value;
  }

  // Check if another event is triggered by this one
  let nextPhase = state.phase;
  let nextEvents: string[] = [];
  if (effect.triggerNextEvent) {
    const next = GAME_EVENTS.find(e => e.id === effect.triggerNextEvent);
    if (next) nextEvents = [next.id];
  } else {
    nextPhase = 'HUB';
  }

  return {
    ...state,
    phase: nextPhase,
    player: newPlayer,
    finances: newFinances,
    narrative: {
      ...state.narrative,
      activeEvents: nextEvents,
      flags: newFlags
    }
  };
}
