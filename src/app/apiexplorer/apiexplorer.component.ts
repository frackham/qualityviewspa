import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { temppart } from '../model/temppart';
import { tempproject } from '../model/tempproject';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-apiexplorer',
  templateUrl: './apiexplorer.component.html',
  styleUrls: ['./apiexplorer.component.scss']
})
export class ApiExplorerComponent implements OnChanges, OnInit {
  @ViewChild('agGridProject') agGridProject!: AgGridAngular;
  @ViewChild('agGridPart') agGridPart!: AgGridAngular;


  private gridApi: any;
  private gridColumnApi: any;

  dataLoaded: string[] = [];

  projects: tempproject[] = [];
  projectColumnDefs: any[] = [];
  projectRowData: any[] = [];

  parts: temppart[] = [];
  partColumnDefs: any[] = [];
  partRowData: any[] = [];
  changelog: any;

  constructor( public apiService: ApiService) {
    this.prepareGrids();
    this.preloadData();

  }

  prepareGrids() {
    this.projectColumnDefs = [
      { field: 'id', sortable: true, filter: true, checkboxSelection: true },
      { field: 'name', sortable: true, filter: true, editable:true},
      { field: 'description', sortable: true, filter: true, editable:true},
      { field: 'updatedOn', sortable: true, filter: true},
      { field: 'isDefault', sortable: true, filter: true}
    ];


    this.partColumnDefs = [
      { field: 'id', sortable: true, filter: true, checkboxSelection: true },
      { field: 'name', sortable: true, filter: true, editable:true},
      { field: 'description', sortable: true, filter: true, editable:true}
    ];

  }

  onCellValueChanged_Project(params: any) {
    var changedData:any = [params.data];
    params.api.applyTransaction({ update: changedData });

    var apiObject = changedData[0];
    try {
      this.apiService.postSingleProject(apiObject.id, apiObject);
    } catch {
      throw `Failed to write changes to project ${changedData}, ${apiObject}`;
    }

  }
  onCellValueChanged_Part(params: any) {
    var changedData:any = [params.data];
    params.api.applyTransaction({ update: changedData });

    var apiObject = changedData[0];
    try {
      this.apiService.postSinglePart(apiObject.id, apiObject);
    } catch {
      throw `Failed to write changes to part ${changedData}, ${apiObject}`;
    }

  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  ngOnChanges(changes: SimpleChanges): void{
    console.log('OnChanges');
    console.log(JSON.stringify(changes));

    // tslint:disable-next-line:forin
    for (const propName in changes) {
         const change = changes[propName];
         const to  = JSON.stringify(change.currentValue);
         const from = JSON.stringify(change.previousValue);
         const changeLog = `${propName}: changed from ${from} to ${to} `;
         this.changelog.push(changeLog);
    }
}

  ngOnInit(): void {


  }


  preloadData(){

    this.apiService.getProjects(0).subscribe((res: {}) => {
      try {
        this.projects = <tempproject[]>res;
        this.dataLoaded.push('projects');
        console.log('APIExplorer: projects loaded');
        console.log(this.projects);

        this.projectRowData = this.projects;

      } catch {
        throw "Failed to retrieve projects";
      }
    });

    this.apiService.getParts(0).subscribe((res: {}) => {
      try {
        this.parts = <temppart[]>res;
        this.dataLoaded.push('parts');
        console.log('APIExplorer: parts loaded');
        console.log(this.parts);


        this.partRowData = this.parts;
      } catch {
        throw "Failed to retrieve parts";
      }
    });
  }


}
