import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFlashcardComponent } from './edit-flashcard.component';

describe('EditFlashcardComponent', () => {
  let component: EditFlashcardComponent;
  let fixture: ComponentFixture<EditFlashcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFlashcardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFlashcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
