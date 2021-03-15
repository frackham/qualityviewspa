import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiexplorerComponent } from './apiexplorer.component';

describe('ApiexplorerComponent', () => {
  let component: ApiexplorerComponent;
  let fixture: ComponentFixture<ApiexplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiexplorerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiexplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
