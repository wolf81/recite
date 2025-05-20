import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Flashcard } from '../../core/models/flashcard.model';
import { FlashcardService } from '../../core/services/flashcard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeckService } from '../../core/services/deck.service';
import { Deck } from '../../core/models/deck.model';
import { ActivatedRoute } from '@angular/router';
import { PagedTableComponent } from '../../ui/paged-table/paged-table.component';
import { PageLayoutComponent } from '../../ui/page-layout/page-layout.component';
import { DialogService } from '../../ui/dialog/dialog.service';
import { EditFlashcardComponent } from '../../modals/edit-flashcard/edit-flashcard.component';
import { DialogBuilder } from '../../ui/dialog/dialog-builder';
import { ToolbarButton } from '../../ui/models/toolbar-button.model';

@Component({
  selector: 'app-deck',
  standalone: true,
  imports: [CommonModule, FormsModule, PagedTableComponent, PageLayoutComponent],
  templateUrl: './deck.component.html',
  styleUrl: './deck.component.css'
})
export class DeckComponent implements OnInit {
  flashcards: Flashcard[] = [];
  newFront = '';
  newBack = '';
  actionButtons: ToolbarButton[] = [
    {
      icon: 'ti ti-plus',
      tooltip: 'Add flashcard',
      action: () => this.createFlashcard()
    },
  ];
  deck = Deck.dummy;

  @ViewChild(PagedTableComponent) pagedList!: PagedTableComponent<Flashcard>;
  @ViewChild('frontInput') frontInput!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private deckService: DeckService,
    private flashcardService: FlashcardService,
    private dialogService: DialogService) {}

  ngOnInit() {
    const deckId = this.route.snapshot.paramMap.get('deckId')!;
    this.deck = this.deckService.getById(deckId)!;
    this.loadFlashcards();
  }

  removeFlashcard(id: string) {
    this.flashcardService.remove(id);
    this.loadFlashcards();
  }

  createFlashcard() {
    const builder = new DialogBuilder<EditFlashcardComponent, Flashcard>(EditFlashcardComponent)
      .withTitle('Add Flashcard')
      .withData(Flashcard.create(this.deck.id))
      .withOkText('Add');

    this.dialogService.open(builder).then(result => {
      if (result.action == 'submit' && result.data) {
        this.flashcardService.add(result.data);
        this.loadFlashcards();

        const newDeck = this.flashcards.filter(d => d.id == result.data?.id)[0];
        this.pagedList.highlightRow(newDeck);
      }
    });
  }

  editFlashcard(flashcard: Flashcard) {
    const builder = new DialogBuilder<EditFlashcardComponent, Flashcard>(EditFlashcardComponent)
      .withTitle('Edit Flashcard')
      .withOkText('Save')
      .withData(flashcard);

    this.dialogService.open(builder).then(result => {
      if (result.action == 'submit' && result.data) {
        this.flashcardService.update(result.data);
        this.loadFlashcards();

        const updatedDeck = this.flashcards.filter(d => d.id == result.data?.id)[0];
        this.pagedList.highlightRow(updatedDeck);
      }
    });
  }

  private loadFlashcards() {
    this.flashcards = this.deck ? this.flashcardService.getByDeck(this.deck.id) : []
  }
}
