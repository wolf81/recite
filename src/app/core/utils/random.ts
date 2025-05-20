/**
 * A class for generating pseudo-random numbers using a seed.
 * Uses Mulberry32 PRNG algorithm for randomness.
 */
export class Random {
  /** The internal state of the PRNG (initialized with the current timestamp). */
  private state: number = Date.now();

  /**
   * Creates an instance of the Random class.
   *
   * @param seed - An optional seed value, which can be a string or a number. If not provided,
   *               the current time (Date.now()) is used as the seed.
   */
  constructor(seed?: string | number) {
    if (seed !== undefined) {
      this.state = typeof seed === 'string' ? Random.hashString(seed) : seed;
    }
  }

  /**
   * Hashes a string into a 32-bit integer.
   * This is used to convert a string seed into a numeric value for the PRNG.
   *
   * @param str - The string to hash.
   * @returns The 32-bit integer hash.
   */
  private static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
    }
    return hash;
  }

  /**
   * Generates a pseudo-random floating point number between 0 (inclusive) and 1 (exclusive).
   * This method uses the Mulberry32 PRNG algorithm.
   *
   * @returns A random float in the range [0, 1).
   */
  next(): number {
    this.state |= 0;
    this.state = this.state + 0x6D2B79F5 | 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Generates a pseudo-random integer in the range [0, max).
   *
   * @param max - The upper bound (exclusive) for the random integer.
   * @returns A random integer between 0 and max (exclusive).
   */
  nextInt(max: number): number {
    return Math.floor(this.next() * max);
  }

  /**
   * Shuffles an array using the Fisher-Yates shuffle algorithm and this PRNG for randomness.
   *
   * @param array - The array to shuffle.
   * @returns A new array with the same elements but shuffled.
   */
  shuffle<T>(array: T[]): T[] {
    const result = array.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}
