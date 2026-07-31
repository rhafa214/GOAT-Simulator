import { useState, useRef, useCallback } from 'react';
import { useGameEngine } from '../engine/GameEngine';
import { useGameActions } from '../engine/actions';
import { runSimulation, SimulationRequest, SimulationResult, SimulationCheckpoint } from '../core/domain/simulationEngine';
import { GameState } from '../types';

export function useSimulation() {
  const { state: rootState } = useGameEngine();
  const actions = useGameActions();
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [targetMode, setTargetMode] = useState<string>('');
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [interimState, setInterimState] = useState<GameState | null>(null);
  
  const cancelToken = useRef({ cancelled: false });
  const isRunning = useRef(false);

  const startSimulation = useCallback((request: SimulationRequest) => {
    if (isRunning.current) return;
    
    isRunning.current = true;
    cancelToken.current = { cancelled: false };
    setIsSimulating(true);
    setProgress(0);
    setTargetMode(request.mode);
    setResult(null);
    setInterimState(null);

    const reqWithToken = { ...request, cancelToken: cancelToken.current };
    const generator = runSimulation(rootState, reqWithToken);
    
    const processChunk = () => {
      // process a few steps per frame
      for (let i = 0; i < 5; i++) {
        if (!isRunning.current) return;
        
        const step = generator.next();
        
        if (step.done) {
          isRunning.current = false;
          setIsSimulating(false);
          setResult(step.value as SimulationResult);
          return;
        } else {
          const checkpoint = step.value as SimulationCheckpoint;
          setProgress(checkpoint.progressPercentage);
          setInterimState(checkpoint.currentState);
        }
      }
      
      // Schedule next chunk
      if (isRunning.current) {
        requestAnimationFrame(processChunk);
      }
    };
    
    requestAnimationFrame(processChunk);
  }, [rootState]);

  const cancelSimulation = useCallback(() => {
    cancelToken.current.cancelled = true;
  }, []);

  const applyResult = useCallback(() => {
    if (result) {
      actions.setState(result.finalState);
      setResult(null);
      setInterimState(null);
    }
  }, [result, actions]);

  const dismissResult = useCallback(() => {
    setResult(null);
  }, []);

  return {
    isSimulating,
    progress,
    targetMode,
    result,
    interimState,
    startSimulation,
    cancelSimulation,
    applyResult,
    dismissResult
  };
}
