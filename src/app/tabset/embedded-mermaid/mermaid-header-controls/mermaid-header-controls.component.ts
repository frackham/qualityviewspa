import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatCalendarCellClassFunction} from '@angular/material/datepicker';

import { ThemePalette } from '@angular/material/core';
import { ProjectDataService } from 'src/app/services/project-data.service';

export interface ChipSettings {
  name: string;
  color: ThemePalette;
  selected: boolean;
  // onClick: Function;
}

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

  constructor(private _projectDataService: ProjectDataService) { }

  ngOnInit(): void {
    this._projectDataService.getSubProjects().forEach( subproject => this.filtervalue_chips_subprojectsToShow.push(
      {
        name: subproject,
        color: 'primary',
        selected: true
      }
    ));
    // this.filtervalue_chips_subprojectsToShow = this._projectDataService.getSubProjects();
  }

  changeSelected(e: any, subprojectChip:ChipSettings) {
    console.log(e);
    console.log(subprojectChip);
    console.log(this.filtervalue_chips_subprojectsToShow);
    subprojectChip.color = 'warn';
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
