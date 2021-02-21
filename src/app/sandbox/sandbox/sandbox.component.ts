import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Dimension } from 'src/app/model/dimension';
import { Evidence } from 'src/app/model/evidence';
import { Result } from 'src/app/model/result';

import { ProjectDataService } from '../../services/project-data.service';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.scss']
})
export class SandboxComponent implements OnInit, AfterViewInit {

  @Input() child_id: string= '';

  dimensions: Dimension[] | null = null;
  evidence: Evidence[]| null = null;;
  results: Result[]| null = null;
  dataLoaded:boolean = false;
  attemptedLoads: number = 0;

  constructor(
    private projectDataService: ProjectDataService) {
      // console.log('SandboxComponent:CTOR');
    }

  ngAfterViewInit(): void {
    // console.log('SandboxComponent:ngAfterViewInit');
  }

  ngOnInit(): void {
    // console.log('SandboxComponent:ngOnInit');
    this.loadData();
  }

  tabSelected(){
    this.loadData();
  }

  ngOnChanges() {
    // create header using child_id - used to trigger a refresh from the tabset on change tab.
    // console.log(this.child_id);
    this.loadData();
  }

  loadData(){
    this.attemptedLoads ++;
    // console.log('SandboxComponent:loadData');
    this.dimensions = this.projectDataService.getDimensions();
    this.evidence = this.projectDataService.getEvidence();
    this.results = this.projectDataService.getResults();
  }

  dataAvailable():boolean{
    if(this.dimensions && this.dimensions.length > 0) {
      this.dataLoaded = true;
    }
    if(this.evidence && this.evidence.length > 0) {
      this.dataLoaded = true;

    }
    if(this.results && this.results.length > 0) {
      this.dataLoaded = true;

    }

    if(this.dataLoaded = true) {
      this.loadData();
      return true;
    }

    return false;
  }

}
