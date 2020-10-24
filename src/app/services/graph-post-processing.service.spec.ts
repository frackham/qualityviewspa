import { TestBed } from '@angular/core/testing';

import { GraphPostProcessingService } from './graph-post-processing.service';

describe('GraphPostProcessingService', () => {
  let service: GraphPostProcessingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphPostProcessingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
