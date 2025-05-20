import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flashcard } from '../../core/models/flashcard.model';
import { SchedulerService } from '../../core/services/scheduler.service';
import { FlashcardService } from '../../core/services/flashcard.service';
import { PageLayoutComponent } from '../../ui/page-layout/page-layout.component';
import { Random } from '../../core/utils/random';

@Component({
  standalone: true,
  selector: 'app-training',
  imports: [CommonModule, PageLayoutComponent],
  templateUrl: './training.component.html',
  styleUrl: './training.component.css'
})

export class TrainingComponent {
  allFlashcards: Flashcard[] = [];
  dueFlashcards: Flashcard[] = [];
  random = new Random(new Date().toISOString().split('T')[0]);
  currentIndex = 0;
  showBack = false;
  trainingComplete = false;

  constructor(private flashcardService: FlashcardService, private schedulerService: SchedulerService) {
    this.allFlashcards = flashcardService.getAll()
    this.dueFlashcards = this.shuffleArray(schedulerService.getDueCards(this.allFlashcards));
    this.trainingComplete = this.dueFlashcards.length === 0;
  }

  get currentCard(): Flashcard | null {
    return this.dueFlashcards[this.currentIndex] ?? null;
  }

  revealBack() {
    this.showBack = true;

    if (this.currentCard?.back) {
      this.speak(this.currentCard.back);
    }
  }

  gradeCard(grade: 'again' | 'hard' | 'good' | 'easy') {
    const card = this.currentCard;
    if (card) {
      this.schedulerService.updateCard(card, grade);
      this.flashcardService.update(card);
    }

    this.showBack = false;
    this.currentIndex++;

    if (this.currentIndex >= this.dueFlashcards.length) {
      this.trainingComplete = true;
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (!this.currentCard || this.trainingComplete) return;

    if (!this.showBack) {
      if (event.code === 'Space') {
        event.preventDefault();
        this.revealBack();
        return;
      }
    }

    switch (event.key) {
      case '1': this.gradeCard('again'); break;
      case '2': this.gradeCard('hard'); break;
      case '3': this.gradeCard('good'); break;
      case '4': this.gradeCard('easy'); break;
    }
  }

  speak(text: string) {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'th-TH';

    const setVoice = () => {
      const voices = speechSynthesis.getVoices();
      const thaiVoice = voices.find(v => v.lang.startsWith('th'));

      if (thaiVoice) {
        utterance.voice = thaiVoice;
      } else {
        console.warn('Thai voice not available on this system.');
      }

      speechSynthesis.cancel(); // cancel any current speech
      speechSynthesis.speak(utterance);
    };

    // Voices may not be immediately available
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = setVoice;
    } else {
      setVoice();
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = array.slice(); // Create a copy to avoid mutating original
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(this.random.next() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
