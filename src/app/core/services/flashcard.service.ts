import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Flashcard } from '../models/flashcard.model';
import { isPlatformBrowser } from '@angular/common';

/**
 * The flashcard service is responsible for managing flashcards.
 */
@Injectable({ providedIn: 'root' })
export class FlashcardService {
  private readonly storageKey = 'flashcards';
  private flashcards: Flashcard[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.load();
  }

  getAll(): Flashcard[] {
    if (isPlatformBrowser(this.platformId)) {
      return [...this.flashcards];
    }
    return [];
  }

  getByDeck(deckId: string): Flashcard[] {
    if (isPlatformBrowser(this.platformId)) {
      return this.flashcards.filter(card => card.deckId === deckId);
    }
    return [];
  }

  add(card: Flashcard) {
    if (isPlatformBrowser(this.platformId)) {
      this.flashcards.push(card);
      this.save();
    }
  }

  remove(id: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.flashcards = this.flashcards.filter(card => card.id !== id);
      this.save();
    }
  }

  replaceAll(cards: Flashcard[]) {
    if (isPlatformBrowser(this.platformId)) {
      this.flashcards = [...cards];
      this.save();
    }
  }

  update(updatedCard: Flashcard) {
    if (isPlatformBrowser(this.platformId)) {
      const index = this.flashcards.findIndex(card => card.id === updatedCard.id);
      if (index !== -1) {
        this.flashcards[index] = updatedCard;
        this.save();
      }
    }
  }

  private load() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          this.flashcards = parsed.map((card: Flashcard) => ({
            id: card.id ?? crypto.randomUUID(),
            front: card.front,
            back: card.back,
            deckId: card.deckId,
            interval: card.interval,
            repetitions: card.repetitions,
            easeFactor: card.easeFactor,
            lastReviewDate: card.lastReviewDate
          }));
        } catch {
          console.warn('Failed to parse flashcards');
          this.flashcards = [];
        }
      }
    }
  }

  private save() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.flashcards));
    }
  }
}
