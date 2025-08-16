import { TestBed } from '@angular/core/testing';

import { StatutValidationService } from './statut-validation.service';

describe('StatutValidationService', () => {
  let service: StatutValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatutValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
