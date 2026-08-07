import fs from 'fs';

let content = fs.readFileSync('src/core/domain/progressionEngine.ts', 'utf-8');

// Replace initializeProgression signature and logic
const oldInit = `  public static initializeProgression(rng: IRNG, potentialBase: number): ProgressionState {
    const curveRoll = rng.random();
    let curve: 'EARLY_PEAK' | 'NORMAL' | 'LATE_BLOOMER' = 'NORMAL';
    let peakAge = 26;
    let declineAge = 30;

    if (curveRoll < 0.2) {
      curve = 'EARLY_PEAK';
      peakAge = 23;
      declineAge = 28;
    } else if (curveRoll > 0.8) {
      curve = 'LATE_BLOOMER';
      peakAge = 29;
      declineAge = 33;
    }

    return {
      developmentPoints: {},
      temporaryForm: 0,
      potential: Math.min(99, potentialBase + rng.integer(-5, 5)),
      consistency: rng.integer(5, 15),
      growthCurve: curve,
      growthProfile: 'Consistent',
      peakAge,
      declineAge,
      milestones: []
    };
  }`;

const newInit = `  public static initializeProgression(rng: IRNG, potentialOverall: number, growthProfile: GrowthProfile = 'Consistent'): ProgressionState {
    const curveRoll = rng.random();
    let curve: 'EARLY_PEAK' | 'NORMAL' | 'LATE_BLOOMER' = 'NORMAL';
    let peakAge = 26;
    let declineAge = 30;

    if (curveRoll < 0.2) {
      curve = 'EARLY_PEAK';
      peakAge = 23;
      declineAge = 28;
    } else if (curveRoll > 0.8) {
      curve = 'LATE_BLOOMER';
      peakAge = 29;
      declineAge = 33;
    }

    return {
      developmentPoints: {},
      temporaryForm: 0,
      potential: potentialOverall,
      consistency: rng.integer(5, 15),
      growthCurve: curve,
      growthProfile,
      peakAge,
      declineAge,
      milestones: []
    };
  }`;

if (content.includes(oldInit)) {
  content = content.replace(oldInit, newInit);
  fs.writeFileSync('src/core/domain/progressionEngine.ts', content);
  console.log('progression engine updated');
} else {
  console.log('progression engine NOT FOUND');
}
