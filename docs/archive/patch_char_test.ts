import fs from 'fs';
let content = fs.readFileSync('src/__tests__/GameEngine.characterization.test.tsx', 'utf8');

const testToReplace = `  test('TRAIN_ATTRIBUTE increases technical stat and consumes fitness', () => {
    const { result } = setup();
    
    // Set initial fitness to allow training
    act(() => {
      // We don't have a direct way to set fitness via action, but we can verify it fails if fitness is 0
      // Currently fitness starts at 100 in INITIAL_STATE
    });
    
    const initialFitness = result.current.state.player.rpg.fitness;
    const initialSho = result.current.state.player.technical.SHO;
    const initialHea = result.current.state.player.technical.HEA;
    
    act(() => {
      result.current.dispatch({ type: 'TRAIN_ATTRIBUTE', payload: 'SHO' });
    });
    
    const state = result.current.state;
    // For age < 23 (starts at 17), ageMultiplier is 1.5. growth is 0.5 * 1.5 = 0.75
    // secondary is 0.2 * 1.5 = 0.3
    expect(state.player.rpg.fitness).toBe(initialFitness - 20);
    expect(state.player.technical.SHO).toBe(initialSho + 0.75);
    expect(state.player.technical.HEA).toBe(initialHea + 0.3);
  });`;

const newTest = `  test('SET_TRAINING_PLAN updates the training plan', () => {
    const { result } = setup();
    
    act(() => {
      result.current.dispatch({ type: 'SET_TRAINING_PLAN', payload: { focus: 'FINISHING', intensity: 'HIGH' } });
    });
    
    const state = result.current.state;
    expect(state.player.trainingPlan).toBeDefined();
    expect(state.player.trainingPlan?.focus).toBe('FINISHING');
    expect(state.player.trainingPlan?.intensity).toBe('HIGH');
  });`;

content = content.replace(testToReplace, newTest);
fs.writeFileSync('src/__tests__/GameEngine.characterization.test.tsx', content);
