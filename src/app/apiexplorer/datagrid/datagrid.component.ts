import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-datagrid',
  templateUrl: './datagrid.component.html',
  styleUrls: ['./datagrid.component.scss']
})

export class DatagridComponent<T> implements OnChanges, OnInit {
  @ViewChild('agGridObject') agGridObject!: AgGridAngular;
  @Input()
  modelType!: <T>({ }) => T;
  @Input()
  readModelType?: <T>({ }) => T;
  @Input() nameSingular: string = '';
  @Input() namePlural: string = '';
  @Input() columnDefs: any = null;
  @Input() newObjectTemplate: any = null;
  @Input() listFilter: any = null;

  private gridApi_Object: any;
  private gridColumnApi_Object: any;


  objectsData: any[] = [];
  objectColumnDefs: any[] = [];
  objectRowData: any[] = [];

  changelog: any = [];
  dirty: boolean;
  gridVisible: boolean = true;

  constructor(public apiService: ApiService) {
    this.dirty = true;
  }

  initialise(){
    this.prepareGrid();
    this.preloadData();
  }

  prepareGrid() {
    this.objectColumnDefs = this.columnDefs;
  }

  onGridAdd(){
    // console.log(this.objectRowData[0]);
    // console.log(this.objectRowData);

    var id = Math.max.apply(Math, this.objectRowData.map(function(o) { return o.id; }))
    id ++;
    //New data is added to an array, even if 1 row.
    var newData =
      {
        "id": id,
        "name": "New Object",
        "description": "Object Description",
        "isDefault": false,
        "image": "",
        "logo": "",
        "createdOn": new Date,
        "updatedOn": null
      }
    ;
    var res = this.gridApi_Object.applyTransaction({
      add: [newData],
      addIndex: id,
    });

    try {
      this.apiService.createObject(newData, this.nameSingular);
    } catch {
      throw `Failed to write changes to new object ${newData}.`;
    }
  }

  refreshGrid(){
    this.initialise();
  }

  toggleGrid(){
    this.gridVisible = !this.gridVisible;
  }

  onGridDelete_IsDisabled(){
    //TODO: Refactor to avoid warning in console. Seems to be undefined or null, but not caught by checks below?
    if (this.gridVisible && this.gridApi_Object) {
      if(this.gridApi_Object == null) { return true; } //Null or undefined.
      // console.log(this.gridApi_Object);
      var rows = this.gridApi_Object.getSelectedRows();
      // console.log(rows);
      //We can only delete if there are rows and the grid is ready.
      //Note use of  != null to check for null AND undefined.
      return rows != null ? rows.length == 0 : true; //If rows are null, return disabled, else if rows have values return enabled.
    }
    return true;
  }

  onGridDelete(e: Event){
    if(this.gridApi_Object) {
      var selectedObjects = this.gridApi_Object.getSelectedRows();

      selectedObjects.forEach((row: any) => {
        var id = row.id;
        this.apiService.deleteObject(id, this.nameSingular).subscribe((res: {}) => {
          try {
            var response = res;


            this.objectRowData = this.objectsData;
            this.gridApi_Object.sizeColumnsToFit();

            //Force refresh
            this.initialise();
          } catch {
            throw `Failed to delete object of id ${id}`;
          }
        });
      });
    }
  }


  onCellValueChanged(params: any) {
    var changedData:any = [params.data];
    params.api.applyTransaction({ update: changedData });

    var apiObject = changedData[0];
    try {
      this.apiService.postSingleObject(apiObject.id, apiObject, this.nameSingular);
    } catch {
      throw `Failed to write changes to object ${changedData}, ${apiObject}`;
    }
  }



  onGridReady(params: any) {
    this.gridApi_Object = params.api;
    this.gridColumnApi_Object = params.columnApi;
    this.initialise();
  }



  ngOnChanges(changes: SimpleChanges): void{
    // console.log('OnChanges');
    // console.log(JSON.stringify(changes));

    for (const propName in changes) {
         const change = changes[propName];
         const to  = JSON.stringify(change.currentValue);
         const from = JSON.stringify(change.previousValue);
         const changeLogUpdate = `${propName}: changed from ${from} to ${to} `;
         this.changelog.push(changeLogUpdate);
    }

    //Only load when data is available
    if(this.dirty && this.nameSingular !== '') {
      this.initialise();
    }
}

  ngOnInit(): void {


  }


  preloadData(){
    if(this.gridApi_Object){
      this.apiService.getObjects(0, this.nameSingular, this.listFilter).subscribe((res: any) => {
        try {
          this.objectsData = <any[]>res;
          // console.log(`APIExplorer: objects loaded (${this.nameSingular})`);
          // console.log(this.objectsData);

          this.objectRowData = this.objectsData;
          this.gridApi_Object.sizeColumnsToFit();
          this.dirty = false; //Only is not dirty when data has been successfully loaded AND no changes.
        } catch {
          throw "Failed to retrieve objects";
        }
      });

    }

  }
}
