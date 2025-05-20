import { Injectable } from '@angular/core';
import { ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AutofocusService {
  private readonly maxAttempts = 5;

  focus(inputRef: ElementRef<HTMLInputElement>, attempt: number = 0): void {
    if (inputRef?.nativeElement) {
      inputRef.nativeElement.focus();
    } else if (attempt < this.maxAttempts) {
      // Retry with exponential backoff
      setTimeout(() => this.focus(inputRef, attempt + 1), 50 * (attempt + 1));
    } else {
      console.error('Failed to focus input after retries.');
    }
  }
}
