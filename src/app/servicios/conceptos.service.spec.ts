import { TestBed } from '@angular/core/testing';

import { ConceptosService } from './conceptos.service';

describe('ConceptosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConceptosService = TestBed.get(ConceptosService);
    expect(service).toBeTruthy();
  });
});
