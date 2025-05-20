import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagedTableComponent } from './paged-table.component';

describe('PagedListComponent', () => {
  let component: PagedTableComponent<any>;
  let fixture: ComponentFixture<PagedTableComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagedTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
