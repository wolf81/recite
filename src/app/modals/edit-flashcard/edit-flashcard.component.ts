import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Flashcard } from '../../core/models/flashcard.model';
import { FormsModule } from '@angular/forms';
import { AutofocusService } from '../../ui/services/autofocus.service';

@Component({
  selector: 'app-edit-flashcard',
  imports: [FormsModule],
  templateUrl: './edit-flashcard.component.html',
  styleUrl: './edit-flashcard.component.css'
})
export class EditFlashcardComponent implements AfterViewInit {
  flashcard: Flashcard = Flashcard.create(crypto.randomUUID());

  @ViewChild('frontInput') frontInputRef?: ElementRef<HTMLInputElement>;

  constructor(private autofocusService: AutofocusService) {}

  ngAfterViewInit(): void {
    this.autofocusService.focus(this.frontInputRef!);
  }

  getData(): Flashcard {
    return this.flashcard;
  }

  setData(data: Flashcard): void {
    this.flashcard = data;
  }
}
