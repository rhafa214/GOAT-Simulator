import { expect, test, describe } from 'vitest';
import { ALL_CLUBS, STARTER_CLUBS } from '../data/database';

describe('Club Data', () => {
  test('ALL_CLUBS should contain imported clubs', () => {
    expect(ALL_CLUBS.length).toBeGreaterThan(0);
    expect(ALL_CLUBS[0].name).toBeDefined();
    expect(ALL_CLUBS[0].league).toBeDefined();
  });

  test('STARTER_CLUBS should be validated clubs', () => {
    expect(STARTER_CLUBS.length).toBe(20);
    expect(STARTER_CLUBS.every(c => c.validationStatus === 'VALIDATED')).toBe(true);
  });
});
