import { Injectable } from '@angular/core';
import { Flashcard } from '../models/flashcard.model';
import { DeckService } from './deck.service';

/**
 * The scheduler service is responsible for managing the training schedule.
 */
@Injectable({ providedIn: 'root' })
export class SchedulerService {
  constructor(private deckService: DeckService) {}

  updateCard(card: Flashcard, grade: 'again' | 'hard' | 'good' | 'easy') {
    const today = new Date();

    switch (grade) {
      case 'again':
        card.interval = 1;
        card.repetitions = 0;
        card.easeFactor = 2.5;
        break;
      case 'hard':
        card.interval = Math.max(1, Math.floor(card.interval * 0.8));
        card.easeFactor = Math.max(1.3, card.easeFactor - 0.1);
        break;
      case 'good':
        card.interval = Math.floor(card.interval * card.easeFactor);
        break;
      case 'easy':
        card.interval = Math.floor(card.interval * card.easeFactor * 1.3);
        card.easeFactor += 0.1;
        break;
    }

    card.repetitions += 1;
    card.lastReviewDate = today;
  }

  getDueCards(flashcards: Flashcard[], today: Date = new Date()): Flashcard[] {
    const enabledDeckIds = this.deckService.getAll().filter(deck => deck.enabled).map(deck => deck.id);

    return flashcards.filter(card => {
      const nextReview = new Date(card.lastReviewDate);
      nextReview.setDate(nextReview.getDate() + card.interval);
      return enabledDeckIds.includes(card.deckId) && nextReview <= today;
    });
  }
}
