import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogContent } from '../../ui/dialog/dialog-content.model';
import { Deck } from '../../core/models/deck.model';
import { AutofocusService } from '../../ui/services/autofocus.service';

@Component({
  selector: 'app-edit-deck',
  imports: [FormsModule],
  templateUrl: './edit-deck.component.html',
  styleUrl: './edit-deck.component.css'
})
export class EditDeckComponent implements DialogContent<Deck>, AfterViewInit {
  deck: Deck = Deck.create()

  @ViewChild('nameInput') nameInputRef?: ElementRef<HTMLInputElement>;

  constructor(private autofocusService: AutofocusService) {}

  ngAfterViewInit(): void {
    this.autofocusService.focus(this.nameInputRef!);
  }

  setData(deck: Deck) {
    this.deck = deck;
  }

  getData(): Deck {
    return this.deck;
  }
}
