/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ErrorService } from './Error.service';

describe('Service: Error', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorService]
    });
  });

  it('should ...', inject([ErrorService], (service: ErrorService) => {
    expect(service).toBeTruthy();
  }));
});
