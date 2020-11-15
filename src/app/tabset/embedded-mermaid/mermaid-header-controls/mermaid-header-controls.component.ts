import { Component, OnInit } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';

import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-mermaid-header-controls',
  templateUrl: './mermaid-header-controls.component.html',
  styleUrls: ['./mermaid-header-controls.component.scss']
})
export class MermaidHeaderControlsComponent implements OnInit {
  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;

  constructor() { }

  ngOnInit(): void {
  }

}
