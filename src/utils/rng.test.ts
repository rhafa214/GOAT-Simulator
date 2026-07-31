import { expect, test, describe } from 'vitest';
import { DefaultRNG, SeededRNG } from './rng';

describe('RNG System', () => {
  describe('DefaultRNG', () => {
    const rng = new DefaultRNG();

    test('random() returns float between 0 and 1', () => {
      const val = rng.random();
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(1);
    });

    test('integer() returns int within range', () => {
      const val = rng.integer(5, 10);
      expect(val).toBeGreaterThanOrEqual(5);
      expect(val).toBeLessThanOrEqual(10);
      expect(Number.isInteger(val)).toBe(true);
    });

    test('float() returns float within range', () => {
      const val = rng.float(5, 10);
      expect(val).toBeGreaterThanOrEqual(5);
      expect(val).toBeLessThan(10);
    });

    test('chance() returns boolean', () => {
      const val = rng.chance(50);
      expect(typeof val).toBe('boolean');
    });

    test('chance(100) is always true, chance(0) is always false', () => {
      expect(rng.chance(100)).toBe(true);
      expect(rng.chance(0)).toBe(false);
    });

    test('pick() selects from array', () => {
      const arr = [1, 2, 3];
      const val = rng.pick(arr);
      expect(arr).toContain(val);
    });

    test('pick() throws on empty array', () => {
      expect(() => rng.pick([])).toThrow();
    });

    test('shuffle() returns same items in array', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = rng.shuffle(arr);
      expect(shuffled).toHaveLength(arr.length);
      arr.forEach(i => expect(shuffled).toContain(i));
    });
  });

  describe('SeededRNG', () => {
    test('produces deterministic output', () => {
      const rng1 = new SeededRNG(42);
      const rng2 = new SeededRNG(42);

      expect(rng1.random()).toBe(rng2.random());
      expect(rng1.integer(1, 100)).toBe(rng2.integer(1, 100));
      expect(rng1.pick([1, 2, 3, 4, 5])).toBe(rng2.pick([1, 2, 3, 4, 5]));
    });

    test('produces different output with different seeds', () => {
      const rng1 = new SeededRNG(42);
      const rng2 = new SeededRNG(43);

      expect(rng1.random()).not.toBe(rng2.random());
    });
  });
});
