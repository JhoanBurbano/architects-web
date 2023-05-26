import { TestBed } from '@angular/core/testing';

import { USerGuardGuard } from './user-guard.guard';

describe('USerGuardGuard', () => {
  let guard: USerGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(USerGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
