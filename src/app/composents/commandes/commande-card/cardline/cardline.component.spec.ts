import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardlineComponent } from './cardline.component';

describe('CardlineComponent', () => {
  let component: CardlineComponent;
  let fixture: ComponentFixture<CardlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardlineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
