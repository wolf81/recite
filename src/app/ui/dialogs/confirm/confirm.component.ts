import { Component } from '@angular/core';

@Component({
  selector: 'app-confirm',
  imports: [],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css'
})
export class ConfirmComponent {
  message: string = ''

  setData(message: string) {
    this.message = message;
  }

  getData(): string {
    return this.message;
  }
}
