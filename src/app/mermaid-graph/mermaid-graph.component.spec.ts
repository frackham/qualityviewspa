import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MermaidGraphComponent } from './mermaid-graph.component';

describe('MermaidGraphComponent', () => {
  let component: MermaidGraphComponent;
  let fixture: ComponentFixture<MermaidGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MermaidGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MermaidGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
