import { TestBed } from '@angular/core/testing';

import { FincaService } from './finca.service';

describe('FincaService', () => {
  let service: FincaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FincaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
