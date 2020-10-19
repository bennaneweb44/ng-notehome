import { TestBed } from '@angular/core/testing';

import { ArticlesnotesService } from './articlesnotes.service';

describe('ArticlesNotesService', () => {
  let service: ArticlesnotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticlesnotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
