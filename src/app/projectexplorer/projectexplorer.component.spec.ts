import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectexplorerComponent } from './projectexplorer.component';

describe('ProjectexplorerComponent', () => {
  let component: ProjectexplorerComponent;
  let fixture: ComponentFixture<ProjectexplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectexplorerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectexplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
