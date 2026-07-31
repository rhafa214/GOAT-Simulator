import { expect, test, describe } from 'vitest';
import { ALL_CLUBS, MOCK_STARTER_CLUBS } from '../data/database';

describe('Club Data', () => {
  test('ALL_CLUBS should contain imported clubs', () => {
    expect(ALL_CLUBS.length).toBeGreaterThan(0);
    expect(ALL_CLUBS[0].name).toBeDefined();
    expect(ALL_CLUBS[0].league).toBeDefined();
  });

  test('MOCK_STARTER_CLUBS should have logos', () => {
    expect(MOCK_STARTER_CLUBS.length).toBeGreaterThan(0);
    expect(MOCK_STARTER_CLUBS[0].logo).toBeDefined();
  });
});
