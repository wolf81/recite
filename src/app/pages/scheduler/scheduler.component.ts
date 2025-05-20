import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flashcard } from '../../core/models/flashcard.model';
import { FlashcardService } from '../../core/services/flashcard.service';
import { ToolbarButton } from '../../ui/models/toolbar-button.model';
import { PagedTableColumn } from '../../ui/paged-table/paged-table-column.model';
import { PagedTableComponent } from '../../ui/paged-table/paged-table.component';
import { PageLayoutComponent } from '../../ui/page-layout/page-layout.component';
import { DeckService } from '../../core/services/deck.service';

@Component({
  standalone: true,
  selector: 'app-scheduler',
  imports: [CommonModule, PagedTableComponent, PageLayoutComponent],
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})

export class SchedulerComponent implements OnInit {
  flashcards: Flashcard[] = [];
  today = new Date();
  actionButtons: ToolbarButton[] = [
      {
        icon: 'ti ti-clock-24',
        tooltip: 'Fast-forward 24 hours',
        action: () => this.fastForwardAllCards(1)
      }
  ];
  activeDeckIds: string[] = [];

  columns: PagedTableColumn<Flashcard>[] = [
    { label: 'Front', mapper: 'front' },
    { label: 'Back', mapper: 'back' },
    { label: 'Interval', mapper: 'interval' },
    { label: 'Repetitions', mapper: 'repetitions' },
    { label: 'Ease Factor', mapper: card => card.easeFactor.toFixed(2) },
    { label: 'Last Review', mapper: card => card.lastReviewDate ? new Date(card.lastReviewDate).toLocaleDateString() : '' },
    { label: 'Is Due?', mapper: card => this.isDue(card) }
  ]

  constructor(private deckService: DeckService, private flashcardService: FlashcardService) {
    const decks = deckService.getAll();
    this.activeDeckIds = decks.filter(deck => deck.enabled).map(deck => deck.id);
  }

  ngOnInit(): void {
    this.loadFlashcards();
  }

  fastForwardAllCards(days: number = 1): void {
    for (const card of this.flashcards) {
      // TODO: perhaps move this code into FlashcardService?
      const date = new Date(card.lastReviewDate);
      date.setDate(date.getDate() - days);
      card.lastReviewDate = date;

      this.flashcardService.replaceAll(this.flashcards);
      this.loadFlashcards();
    }
  }

  getNextReviewDate(card: Flashcard): Date {
    const next = new Date(card.lastReviewDate);
    next.setDate(next.getDate() + card.interval);
    return next;
  }

  isDue(card: Flashcard): boolean {
    return this.activeDeckIds.includes(card.deckId) && this.getNextReviewDate(card) <= this.today;
  }

  private loadFlashcards() {
    this.flashcards = this.flashcardService.getAll();
  }
}
