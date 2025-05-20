/**
 * Represents a flashcard and also stores training-related data.
 */
export class Flashcard {
  constructor(
    /**
     * A unique identifier.
     */
    public id: string = crypto.randomUUID(),

    /**
     * The front text of the card.
     */
    public front: string,

    /**
     * The back text of the card.
     */
    public back: string,

    /**
     * The id of the deck this card belongs to.
     */
    public deckId: string,

    /**
     * An interval in days until next training session can occur.
     */
    public interval: number = 1,

    /**
     * The number of times this card has been shown.
     */
    public repetitions: number = 0,

    /**
     * A value representing the card difficulty.
     */
    public easeFactor: number = 2.5,

    /**
     * The last time this card was shown in a training session.
     */
    public lastReviewDate: Date = new Date()
  ) {}

  static create(deckId: string, front: string = '', back: string = '') : Flashcard {
    return {
      id: crypto.randomUUID(),
      front: front,
      back: back,
      deckId: deckId,
      interval: 1,
      lastReviewDate: new Date(),
      easeFactor: 2.5,
      repetitions: 0
    }
  }
}
