import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { temppartsofprojects } from '../model/temppartsofprojects';
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


  private gridApi_Project: any;
  private gridColumnApi_Project: any;

  private gridApi_Part: any;
  private gridColumnApi_Part: any;

  dataLoaded: string[] = [];

  projects: tempproject[] = [];
  projectColumnDefs: any[] = [];
  projectRowData: any[] = [];

  // parts: temppart[] = [];
  parts: temppartsofprojects[] = [];
  partColumnDefs: any[] = [];
  partRowData: any[] = [];
  changelog: any;

  //Generic values:
  noteColumnDefs =  [
    { headerName: 'ID', field: 'id', sortable: true, filter: true, checkboxSelection: true, resizable: false, width:130 },
    { headerName: 'Todo?', field: 'todo', sortable: true, editable:true, filter: true, resizable: false, width:130},
    { headerName: 'Note', field: 'text', sortable: true, filter: 'agTextColumnFilter', editable:true, width: 800}
  ];
  noteTemplate = {
      "id": null,
      "text": "lorem ipsum",
      "todo": true
  };

  qualitydimensionColumnDefs =  [
    { headerName: 'ID', field: 'id', sortable: true, filter: true, checkboxSelection: true, resizable: false, width:130 },
    { headerName: 'Default?', field: 'is_default', sortable: true, editable:true, filter: true, resizable: false, width:130},
    { headerName: 'Name', field: 'name', sortable: true, editable:true, filter: true, resizable: false},
    { headerName: 'Description', field: 'description', sortable: true, filter: 'agTextColumnFilter', editable:true},
    { headerName: 'Default Result Type', field: 'defaultresulttype', sortable: true, editable:true, filter: true, resizable: false},
    { headerName: 'Why does the Dimension matter?', field: 'why', sortable: true, editable:true, filter: true, resizable: false},
    { headerName: 'References for why it matters', field: 'why_sources', sortable: true, editable:true, filter: true, resizable: false},
  ];
  qualitydimensionTemplate = {
      "id": null,
      "name": "Dimension Name",
      "description": "Description",
      "is_default": false,
      "defaultresulttype": 1,
      "why": "Why does this dimension offer value to the organisation?",
      "why_sources": "References for why this dimension matters if you need to convince someone (e.g. primary research).",
      "image": ""
  };

  partqualitydimensionColumnDefs =  [
    { headerName: 'ID', field: 'id', sortable: true, filter: true, checkboxSelection: true, resizable: false, width:130 },
    { headerName: 'Default?', field: 'is_default', sortable: true, editable:true, filter: true, resizable: false, width:130},
    { headerName: 'Name', field: 'name', sortable: true, editable:true, filter: true, resizable: false},
    { headerName: 'Description', field: 'description', sortable: true, filter: 'agTextColumnFilter', editable:true},
    { headerName: 'Default Result Type', field: 'defaultresulttype', sortable: true, editable:true, filter: true, resizable: false},
    { headerName: 'Why does the Dimension matter?', field: 'why', sortable: true, editable:true, filter: true, resizable: false},
    { headerName: 'References for why it matters', field: 'why_sources', sortable: true, editable:true, filter: true, resizable: false},
  ];
  partqualitydimensionTemplate = {
      "id": null,
      "name": "Dimension Name",
      "description": "Description",
      "is_default": false,
      "defaultresulttype": 1,
      "why": "Why does this dimension offer value to the organisation?",
      "why_sources": "References for why this dimension matters if you need to convince someone (e.g. primary research).",
      "image": ""
  };


  constructor( public apiService: ApiService) {
    this.prepareGrids();
    this.preloadData();

  }

  prepareGrids() {
    this.projectColumnDefs = [
      { headerName: 'ID', field: 'id', sortable: true, filter: true, checkboxSelection: true },
      { headerName: 'Project Name', field: 'name', sortable: true, filter: true, editable:true},
      { headerName: 'Description', field: 'description', sortable: true, filter: true, editable:true},
      { headerName: 'Last Updated', field: 'updatedOn', sortable: true, filter: true},
      { headerName: 'Default Project?', field: 'isDefault', sortable: true, filter: true}
    ];

    this.partColumnDefs = [
      { headerName: 'ID', field: 'id', sortable: true, filter: true, checkboxSelection: true },
      { headerName: 'Project ID', field: 'projectId', sortable: true, filter: true },
      { headerName: 'Project Name', field: 'projectName', sortable: true, filter: true},
      { headerName: 'Project Description', field: 'projectDescription', sortable: true, filter: true},
      { headerName: 'Part ID', field: 'partId', sortable: true, filter: true },
      { headerName: 'Part Name', field: 'partName', sortable: true, filter: true, editable:true},
      { headerName: 'Part Description', field: 'partDescription', sortable: true, filter: true, editable:true}
    ];

  }

  onGridAdd_Project(){
    // console.log(this.projectRowData[0]);
    console.log(this.projectRowData);

    var id = Math.max.apply(Math, this.projectRowData.map(function(o) { return o.id; }))
    id ++;
    //New data is added to an array, even if 1 row.
    var newData =
      {
        "id": id,
        "name": "New Project",
        "description": "Project Description",
        "isDefault": false,
        "image": "",
        "logo": "",
        "createdOn": new Date,
        "updatedOn": null
      }
    ;
    var res = this.gridApi_Project.applyTransaction({
      add: [newData],
      addIndex: id,
    });

    try {
      this.apiService.createProject(newData);
    } catch {
      throw `Failed to write changes to new project ${newData}.`;
    }
  }

  onGridAdd_Part(){
    console.log(this.partRowData[0]);
    this.partRowData.push();
  }

  onGridDelete_IsDisabled_Project(){
    if(!this.gridApi_Project) { return true; }
    return this.gridApi_Project.getSelectedRows().length == 0;
  }
  onGridDelete_IsDisabled_Part(){
    if(!this.gridApi_Part) { return true; }
    return this.gridApi_Part.getSelectedRows().length == 0;
  }
  onGridDelete_Project(e: Event){
    var selectedProjects = this.gridApi_Project.getSelectedRows();

    selectedProjects.forEach((row: any) => {
      var id = row.id;
      this.apiService.deleteProject(id).subscribe((res: {}) => {
        try {
          var response = res;


          this.projectRowData = this.projects;
          this.gridApi_Project.sizeColumnsToFit();
          //Force grid to update.
          this.preloadData();
        } catch {
          throw `Failed to delete project of id ${id}`;
        }
      });
    });
  }
  onGridDelete_Part(e: Event){
    var selectedParts = this.gridApi_Part.getSelectedRows();

    selectedParts.forEach((row: any) => {
      var id = row.id;
      this.apiService.deletePart(id).subscribe((res: {}) => {
        try {
          var response = res;


          this.partRowData = this.parts;
          this.gridApi_Part.sizeColumnsToFit();
        } catch {
          throw `Failed to delete part of id ${id}`;
        }
      });
    });
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

  onGridReady_Project(params: any) {
    this.gridApi_Project = params.api;
    this.gridColumnApi_Project = params.columnApi;
  }
  onGridReady_Part(params: any) {
    this.gridApi_Part = params.api;
    this.gridColumnApi_Part = params.columnApi;
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
        this.gridApi_Project.sizeColumnsToFit();
      } catch {
        throw "Failed to retrieve projects";
      }
    });

    // this.apiService.getParts(0).subscribe((res: {}) => {
    //   try {
    //     this.parts = <temppart[]>res;
    //     this.dataLoaded.push('parts');
    //     console.log('APIExplorer: parts loaded');
    //     console.log(this.parts);


    //     this.partRowData = this.parts;
    //   } catch {
    //     throw "Failed to retrieve parts";
    //   }
    // });

    this.apiService.getPartDetails(0).subscribe((res: {}) => {
      try {
        this.parts = <temppartsofprojects[]>res;
        this.dataLoaded.push('partsofprojects');
        console.log('APIExplorer: partsofprojects loaded');
        console.log(this.parts);


        this.partRowData = this.parts;
      } catch {
        throw "Failed to retrieve parts";
      }
    });

  }


}
