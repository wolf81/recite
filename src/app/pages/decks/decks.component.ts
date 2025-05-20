import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DeckService } from '../../core/services/deck.service';
import { Deck } from '../../core/models/deck.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FlashcardService } from '../../core/services/flashcard.service';
import { ToolbarButton } from '../../ui/models/toolbar-button.model';
import { EditDeckComponent } from '../../modals/edit-deck/edit-deck.component';
import { DialogService } from '../../ui/dialog/dialog.service';
import { DialogBuilder } from '../../ui/dialog/dialog-builder';
import { createColumns } from '../../ui/paged-table/paged-table-column.model';
import { PagedTableComponent } from '../../ui/paged-table/paged-table.component';
import { PageLayoutComponent } from '../../ui/page-layout/page-layout.component';

@Component({
  selector: 'app-decks',
  standalone: true,
  imports: [CommonModule, FormsModule, PagedTableComponent, PageLayoutComponent],
  templateUrl: './decks.component.html',
  styleUrl: './decks.component.css'
})

export class DecksComponent implements OnInit {
  decks: Deck[] = [];
  titleButtons: ToolbarButton[] = [
      {
        icon: 'ti ti-upload',
        tooltip: 'Upload flashcards',
        action: () => this.fileInput.nativeElement.click()
      },
      {
        icon: 'ti ti-download',
        tooltip: 'Download flashcards',
        action: () => this.exportDecks()
      }
  ]

  actionButtons: ToolbarButton[] = [
    { icon: 'ti ti-plus', action: () => this.createDeck(), tooltip: '' }
  ];

  @ViewChild(PagedTableComponent) pagedList!: PagedTableComponent<Deck>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  columns = createColumns<Deck>([
    { label: 'Name', mapper: 'name', },
    { label: 'Enabled', mapper: 'enabled' }
  ]);

  constructor(
    private flashcardService: FlashcardService,
    private deckService: DeckService,
    private router: Router,
    private dialogService: DialogService) {}

  ngOnInit(): void {
    this.decks = this.deckService.getAll();
  }

  createDeck() {
    const builder = new DialogBuilder<EditDeckComponent, Deck>(EditDeckComponent)
      .withTitle('Add Deck')
      .withOkText('Add');

    this.dialogService.open(builder).then(result => {
      if (result.action == 'submit' && result.data) {
        this.deckService.add(result.data);
        this.loadDecks();

        const newDeck = this.decks.filter(d => d.id == result.data?.id)[0];
        this.pagedList.highlightRow(newDeck);
      }
    });
  }

  editDeck(deck: Deck) {
    const builder = new DialogBuilder<EditDeckComponent, Deck>(EditDeckComponent)
      .withTitle('Edit Deck')
      .withOkText('Save')
      .withData(deck);

    this.dialogService.open(builder).then(result => {
      if (result.action == 'submit' && result.data) {
        this.deckService.update(result.data);
        this.loadDecks();

        const updatedDeck = this.decks.filter(d => d.id == result.data?.id)[0];
        this.pagedList.highlightRow(updatedDeck);
      }
    });
  }

  showDeck(deck: Deck) {
    this.router.navigate(['/decks', deck.id]);
  }

  deleteDeck(deckId: string) {
    const deck = this.deckService.getById(deckId)!;
    this.dialogService.showConfirmation(
      'Delete Deck',
      `Are you sure you want to delete deck '${deck.name}'?`,
      'Delete').then(result => {
      if (result) {
        this.deckService.remove(deckId);
        this.loadDecks();
      }
    })
  }

  exportDecks() {
    const data = {
      ['flashcards']: this.flashcardService.getAll(),
      ['decks']: this.deckService.getAll(),
    }

    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flashcards.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  importDecks(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);

        const flashcards = json['flashcards']
        if (flashcards && Array.isArray(flashcards)) {
          this.flashcardService.replaceAll(flashcards);
        }

        const decks = json['decks']
        if (decks && Array.isArray(decks)) {
          this.deckService.replaceAll(decks)
        }

        this.loadDecks();
      } catch (e) {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
  }

  private loadDecks() {
    this.decks = this.deckService.getAll();
  }
}
