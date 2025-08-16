import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovisionnementFormComponent } from './approvisionnement-form.component';

describe('ApprovisionnementFormComponent', () => {
  let component: ApprovisionnementFormComponent;
  let fixture: ComponentFixture<ApprovisionnementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovisionnementFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovisionnementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
