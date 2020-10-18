import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbeddedMermaidComponent } from './embedded-mermaid.component';

describe('EmbeddedMermaidComponent', () => {
  let component: EmbeddedMermaidComponent;
  let fixture: ComponentFixture<EmbeddedMermaidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmbeddedMermaidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbeddedMermaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
