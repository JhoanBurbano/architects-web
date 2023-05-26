import { TestBed } from '@angular/core/testing';

import { AsesorGuard } from './asesor.guard';

describe('AsesorGuard', () => {
  let guard: AsesorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AsesorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
