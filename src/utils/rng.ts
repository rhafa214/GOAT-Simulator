export interface IRNG {
  /** Float entre 0 (inclusivo) e 1 (exclusivo) */
  random(): number;
  /** Inteiro entre min (inclusivo) e max (inclusivo) */
  integer(min: number, max: number): number;
  /** Float entre min (inclusivo) e max (exclusivo) */
  float(min: number, max: number): number;
  /** Chance percentual (0 a 100) */
  chance(percent: number): boolean;
  /** Escolha aleatória de item de um array */
  pick<T>(items: T[]): T;
  /** Embaralha um array */
  shuffle<T>(items: T[]): T[];
}

export class DefaultRNG implements IRNG {
  random(): number {
    return Math.random();
  }

  integer(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  float(min: number, max: number): number {
    return this.random() * (max - min) + min;
  }

  chance(percent: number): boolean {
    return this.random() * 100 < percent;
  }

  pick<T>(items: T[]): T {
    if (!items || items.length === 0) throw new Error("Cannot pick from empty array");
    return items[this.integer(0, items.length - 1)];
  }

  shuffle<T>(items: T[]): T[] {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.integer(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

export class SeededRNG extends DefaultRNG {
  public seed: number;

  constructor(seed: number) {
    super();
    this.seed = seed;
  }

  random(): number {
    let t = this.seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

export let rng: IRNG = new DefaultRNG();

export function setRNG(newRNG: IRNG) {
  rng = newRNG;
}
