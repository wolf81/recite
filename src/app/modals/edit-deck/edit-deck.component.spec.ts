import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeckComponent } from './edit-deck.component';

describe('EditDeckComponent', () => {
  let component: EditDeckComponent;
  let fixture: ComponentFixture<EditDeckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDeckComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
