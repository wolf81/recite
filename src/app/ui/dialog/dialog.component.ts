import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

@Component({
  selector: 'app-dialog',
  imports: [CommonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {
  @ViewChild('content', { read: ViewContainerRef, static: true }) contentRef!: ViewContainerRef;

  @Input() title = '';
  @Input() okText = 'OK';
  @Input() cancelText = 'Cancel';

  @Output() submit = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    this.onCancel();
  }

  @HostListener('document:keydown.enter', ['$event'])
  handleEnter(event: KeyboardEvent) {
    this.onSubmit();
  }

  onSubmit() {
    this.submit.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
