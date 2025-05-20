/**
 * Represents a flash card deck, but doesn't contain the cards itself.
 */
export class Deck {
  constructor(
    /**
     * A unique identifier.
     */
    public id: string = crypto.randomUUID(),

    /**
     * The name of the deck.
     */
    public name: string = '',

    /**
     * Whether this deck should be part of training.
     */
    public enabled: boolean = true,
  ) {}

  static dummy: Deck = new Deck('dummy');

  static create(name: string = ''): Deck {
    return {
      id: crypto.randomUUID(),
      name: name,
      enabled: true,
    }
  }
}
