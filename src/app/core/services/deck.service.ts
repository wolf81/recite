import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Deck } from "../models/deck.model";
import { isPlatformBrowser } from "@angular/common";

/**
 * The deck service is responsible for managing decks of flashcards.
 *
 * PLEASE NOTE: only decks are managed here - the flashcard service is responsbile for managing flashcards.
 */
@Injectable({ providedIn: 'root' })
export class DeckService {
  private readonly storageKey = 'decks';
  private decks: Deck[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.load();
  }

  replaceAll(decks: Deck[]) {
    if (isPlatformBrowser(this.platformId)) {
      this.decks = [...decks];
      this.save();
    }
  }

  getAll(): Deck[] {
    if (isPlatformBrowser(this.platformId)) {
      return this.decks;
    }
    return [];
  }

  getById(id: string): Deck | undefined {
    if (isPlatformBrowser(this.platformId)) {
      return this.decks.find(deck => deck.id === id);
    }
    return undefined; // TODO: lets make a default deck if none are defined
  }

  update(updatedDeck: Deck) {
    if (isPlatformBrowser(this.platformId)) {
      const index = this.decks.findIndex(deck => deck.id === updatedDeck.id);
      if (index !== -1) {
        this.decks[index] = updatedDeck;
        this.save();
      }
    }
  }

  add(deck: Deck) {
    if (isPlatformBrowser(this.platformId)) {
      this.decks.push(deck);
      this.save();
    }
  }

  remove(id: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.decks = this.decks.filter(deck => deck.id != id);
      this.save();
    }
  }

  private load() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
          const parsed = JSON.parse(saved);
          this.decks = parsed.map((deck: Deck) => ({
            id: deck.id ?? crypto.randomUUID(),
            name: deck.name,
            enabled: deck.enabled ?? true
          }));
      }
    }
  }

  private save() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.decks));
    }
  }
}
