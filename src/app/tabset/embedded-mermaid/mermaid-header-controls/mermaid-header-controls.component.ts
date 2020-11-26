import { Component, EventEmitter, OnInit, AfterViewInit, Output, ViewEncapsulation } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatCalendarCellClassFunction} from '@angular/material/datepicker';

import { ThemePalette } from '@angular/material/core';
import { ProjectDataService } from 'src/app/services/project-data.service';
import { ChipSettings } from './ChipSettings';

@Component({
  selector: 'app-mermaid-header-controls',
  templateUrl: './mermaid-header-controls.component.html',
  styleUrls: ['./mermaid-header-controls.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MermaidHeaderControlsComponent implements OnInit {
  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;
  filtervalue_chips_subprojectsToShow: ChipSettings[] = [];
  filtervalue_chips_subprojectsToShow_shouldEmit: boolean = false;

  constructor(private _projectDataService: ProjectDataService) { }
  @Output() filterUpdate_SubProjects = new EventEmitter<ChipSettings[]>();
  @Output() filterUpdate_RefreshDiagram = new EventEmitter<void>();

  ngOnInit(): void {

  }

  ngAfterViewInit(){

    this.loadSubProjectsToChips();
    this.filtervalue_chips_subprojectsToShow_shouldEmit = true;
  }

  async loadSubProjectsToChips(){
    await this._projectDataService.getSubProjectNames().forEach( subproject => this.filtervalue_chips_subprojectsToShow.push(
      {
        name: subproject,
        color: 'primary',
        selected: true
      }
    ));
    // this.filtervalue_chips_subprojectsToShow = this._projectDataService.getSubProjects();
    console.log('loaded, should be no emit events before this.');
  }

  refreshDiagram(){
    //pass responsibility to parent
    setTimeout(() => {
      this.filterUpdate_RefreshDiagram.emit();
      console.log('manual refresh diagram')
    });
  }

  changeSelected(e: any, subprojectChip:ChipSettings) {
    subprojectChip.selected=!subprojectChip.selected;
    // console.log(e);
    // console.log(subprojectChip);
    // console.log(this.filtervalue_chips_subprojectsToShow);
    // if(e.isUserInput) {
      setTimeout(() => {
        subprojectChip.selected ===true ? subprojectChip.color = 'warn' : subprojectChip.color = 'primary';
        if(this.filtervalue_chips_subprojectsToShow_shouldEmit === true) {this.filterUpdate_SubProjects.emit(this.filtervalue_chips_subprojectsToShow);}
      });
    // }

    //

    //Trigger redraw.
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      const date = cellDate.getDate();

      // Highlight the 1st and 20th day of each month.
      return (date === 1 || date === 20) ? 'example-custom-date-class' : '';
    }

    return '';
  }

}
