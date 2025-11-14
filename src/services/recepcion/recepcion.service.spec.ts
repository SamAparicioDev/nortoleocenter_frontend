import { TestBed } from '@angular/core/testing';

import { RecepcionService } from './recepcion.service';

describe('RecepcionService', () => {
  let service: RecepcionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecepcionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
