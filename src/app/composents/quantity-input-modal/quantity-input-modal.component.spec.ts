import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityInputModalComponent } from './quantity-input-modal.component';

describe('QuantityInputModalComponent', () => {
  let component: QuantityInputModalComponent;
  let fixture: ComponentFixture<QuantityInputModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantityInputModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuantityInputModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
