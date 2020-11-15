import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MermaidHeaderControlsComponent } from './mermaid-header-controls.component';

describe('MermaidHeaderControlsComponent', () => {
  let component: MermaidHeaderControlsComponent;
  let fixture: ComponentFixture<MermaidHeaderControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MermaidHeaderControlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MermaidHeaderControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
