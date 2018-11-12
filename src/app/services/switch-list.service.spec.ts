import { TestBed, inject } from '@angular/core/testing';

import { SwitchListService } from './switch-list.service';

describe('SwitchListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SwitchListService]
    });
  });

  it('should be created', inject([SwitchListService], (service: SwitchListService) => {
    expect(service).toBeTruthy();
  }));
});
